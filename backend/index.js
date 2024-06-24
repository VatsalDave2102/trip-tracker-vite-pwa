const fs = require("fs"); // file system module
const os = require("os"); // operating system module
const path = require("path"); // path module
const cors = require("cors"); // CORS middleware
const UUID = require("uuid-v4"); // UUID generator
const express = require("express"); // Express framework
const webpush = require("web-push"); // Web Push API
const admin = require("firebase-admin"); // Firebase Admin SDK
const { Storage } = require("@google-cloud/storage"); // Google Cloud Storage

require("dotenv").config(); // load environment variables from.env file

const app = express();

app.use(cors()); // enable CORS
app.use(express.json({ limit: "50mb" })); // parse JSON requests with 50mb limit

// Google Cloud config
const gconfig = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	keyFilename: process.env.FIREBASE_ADMIN_KEY_FILE,
};

// instane of google cloud storage
const gcs = new Storage(gconfig);

// initialize firebase admin
if (!admin.apps.length) {
	const serviceAccount = require(`./${process.env.FIREBASE_ADMIN_KEY_FILE}`);

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: process.env.DATABASE_URL,
	});
}

app.post("/postTripData", (request, response) => {
	// extract request body
	const { id, title, location, image, description, startDate, endDate } =
		request.body;

	const uuid = UUID();

	const bucket = gcs.bucket(process.env.FIREBASE_STORAGE); // get storage bucket

	// convert base64 image to buffer
	const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
	const buffer = Buffer.from(base64Data, "base64");
	const filepath = path.join(os.tmpdir(), `${id}`); // create temporary file path

	try {
		fs.writeFileSync(filepath, buffer); // write file to disk
	} catch (error) {
		console.error("Error writing file:", err);
		return response.status(500).json({ error: "Failed to write file" });
	}

	// upload file to Google Cloud Storage
	bucket.upload(
		filepath,
		{
			uploadType: "media",
			metadata: {
				contentType: "image/*",
				metadata: {
					firebaseStorageDownloadTokens: uuid,
				},
			},
		},
		async (err, file) => {
			if (err) {
				console.error("Error while uploading file:", err);
				return response.status(500).json({ error: err });
			}

			const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
				bucket.name
			}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;

			try {
				// store data in Firebase Realtime Database
				admin.database().ref("trips").child(id).set({
					id: id,
					title: title,
					location: location,
					imageUrl: fileUrl,
					description: description,
					startDate: startDate,
					endDate: endDate,
				});

				// send push notification
				webpush.setVapidDetails(
					process.env.VAPID_EMAIL,
					process.env.VAPID_PUB_KEY,
					process.env.VAPID_PVT_KEY
				);
				const subscriptionsSnapshot = await admin
					.database()
					.ref("subscriptions")
					.once("value");

				const subscriptions = subscriptionsSnapshot.val();

				const notificationPromises = Object.values(subscriptions).map(
					async (subscription) => {
						// config for push notification
						const pushConfig = {
							endpoint: subscription.endpoint,
							keys: {
								auth: subscription.keys.auth,
								p256dh: subscription.keys.p256dh,
							},
						};
						try {
							// send push notification
							await webpush.sendNotification(
								pushConfig,
								JSON.stringify({
									title: "New post",
									content: "New post added",
									url: "/trips",
								})
							);
						} catch (error) {
							console.error("Error sending notification", error);
						}
					}
				);
				await Promise.all(notificationPromises);
				response.status(201).json({ messsage: "Data stored", id: id });
			} catch (error) {
				console.error("Error storing data", error);
				response.status(500).json({ error: error });
			}
		}
	);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Server is running on port", PORT);
});
