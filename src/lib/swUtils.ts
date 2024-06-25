import { urlBase64ToUint8Array } from "@/lib/utils";

export const askForInstallation = async (e: Event | null) => {
	if (e) {
		let installPrompt = e as any;
		installPrompt.prompt();
		const choiceResult = installPrompt.userChoice;
		if (choiceResult.outcome === "dismissed") {
			console.log("User cancelled home screen install");
		} else {
			console.log("User added to home screen");
		}
		installPrompt = null;
	}
};

// function to add push subscription
export const configurePushSub = async () => {
	try {
		if (!navigator.serviceWorker) return;
		const serviceWorker = await navigator.serviceWorker.ready;
		const subscription = await serviceWorker.pushManager.getSubscription();

		if (subscription === null) {
			if (!import.meta.env.VITE_VAPID_PUB_KEY) {
				alert("No vapid key found");
				return;
			}

			// no subscription key found, create new
			const vapidPublicKey = import.meta.env.VITE_VAPID_PUB_KEY;
			const newSubscription = await serviceWorker.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
			});

			const url = `${import.meta.env.VITE_DATABASE_URL}/subscriptions.json`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(newSubscription),
			});

			if (response.ok) {
				displayConfirmNotification();
			}
		}
	} catch (error) {
		console.error("[NOTIFICATION]", error);
	}
};

// function to display notification message of confirmation
export const displayConfirmNotification = async () => {
	if ("serviceWorker" in navigator) {
		const options: NotificationOptions = {
			body: "You have successfully subscribed the notification services",
			icon: "/favicon.svg",
			dir: "ltr",
			lang: "en-US",
			badge: "/favicon.svg",
			tag: "confirm-notification",
		};

		const swreg = await navigator.serviceWorker.ready;
		swreg.showNotification("Successfully subscribed", options);
	}
};
