/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { precacheAndRoute } from "workbox-precaching";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { imageCache } from "workbox-recipes";
import { NetworkOnly } from "workbox-strategies";

import { TRIP_STORE, clearAllData, writeData } from "@/lib/indexDb";

clientsClaim();

self.addEventListener("activate", () => self.skipWaiting());

// precache manifest assets
precacheAndRoute(self.__WB_MANIFEST);

// cache images using cache first strategy
imageCache();

// store trips in indexedDB
registerRoute(
	"https://trip-tracker-734be-default-rtdb.asia-southeast1.firebasedatabase.app/trips.json",
	// when route matches, fetch it
	async (e) => {
		return fetch(e.request).then((response) => {
			// clone the response
			const clonedResponse = response.clone();
			// clear existing trips from indexDB
			clearAllData(TRIP_STORE)
				.then(() => clonedResponse.json())
				.then((data) => {
					// write each post of trip in indexedDB
					for (const key in data) {
						writeData(TRIP_STORE, data[key]);
					}
				});
			return response;
		});
	}
);

// plugin for background sync to store failed requests
// in indexedDB, retry request when connectivity established
const bgSyncPlugin = new BackgroundSyncPlugin("background-sync", {
	maxRetentionTime: 24 * 60,
	// callback to run when syncing starts
	onSync: async ({ queue }) => {
		let entry;
		// shift each request from queue and upload it
		while ((entry = await queue.shiftRequest())) {
			try {
				const options: NotificationOptions = {
					body: "Syncing posts in background",
					icon: "/favicon.svg",
					dir: "ltr",
					lang: "en-US",
					badge: "/favicon.svg",
				};

				self.registration.showNotification("Syncing posts", options);
				await fetch(entry.request.clone());
				console.log("Posts have been synced successfully");
			} catch (error) {
				// if request fails, again add it in queue
				const options: NotificationOptions = {
					body: "Posts failed to sync, will retry later",
					icon: "/favicon.svg",
					dir: "ltr",
					lang: "en-US",
					badge: "/favicon.svg",
				};

				self.registration.showNotification("Syncing failed", options);
				console.error("Replay failed for request");

				await queue.unshiftRequest(entry);
				throw error;
			}
		}
	},
});

// attach background sync plugin to post request
registerRoute(
	({ url }) => url.pathname === "/postTripData",
	new NetworkOnly({
		plugins: [bgSyncPlugin],
	}),
	"POST"
);

// listen to push notification that comes from backend
self.addEventListener("push", (event) => {
	// default notification data
	let data = {
		title: "New!",
		content: "Something new happened",
		url: "/",
	};
	if (event.data) {
		data = JSON.parse(event.data.text());
	}
	console.log(data);
	const options: NotificationOptions = {
		body: data.content,
		icon: "/favicon.svg",
		badge: "/favicon.svg",
		data: {
			url: data.url,
		},
	};

	event.waitUntil(self.registration.showNotification(data.title, options));
});

// listen to clicks on notification
self.addEventListener("notificationclick", (event) => {
	const notification = event.notification;
	const action = event.action;

	// if confirm action is clicked
	if (action === "confirm") {
		notification.close();
	} else {
		// if notification is clicked
		event.waitUntil(
			// get current client with visible state
			self.clients.matchAll({ type: "window" }).then((clients) => {
				const client = clients.find((c) => c.visibilityState === "visible");

				// if client is not undefined, navigate user to it
				if (client !== undefined) {
					client.navigate(notification.data.url);
					client.focus();
				} else {
					// if client is undefined, open new window
					self.clients && self.clients.openWindow(notification.data.url);
				}
				notification.close();
			})
		);
		notification.close();
	}
});
