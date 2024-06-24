import { configurePushSub } from "@/lib/swUtils";
import { useEffect, useState } from "react";

export default function useNotification() {
	// Initialize permission status with the current Notification.permission value
	const [permissionStatus, setPermissionStatus] = useState(
		Notification.permission
	);

	// Update permission status on mount
	useEffect(() => {
		setPermissionStatus(Notification.permission);
	}, []);

	// Request notification permission from the user
	const askForNotificationPermission = async () => {
		try {
			// Request permission and update the permission status
			const permission = await Notification.requestPermission();
			setPermissionStatus(permission);
			if (permission !== "granted") {
				// If permission is not granted, return immediately
				return;
			} else {
				// Otherwise, configure push subscription
				configurePushSub();
			}
		} catch (error) {
			console.error("Failed to request notification permission");
		}
	};

	// Return an object with permission status and askForNotificationPermission function
	return {
		permissionStatus: permissionStatus === "granted",
		askForNotificationPermission,
	};
}
