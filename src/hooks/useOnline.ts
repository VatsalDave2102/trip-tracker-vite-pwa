import { useEffect, useState } from "react";

export default function useOnline() {
	// Initialize isOnline state with the current navigator.onLine value
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	// Create effect to listen for online/offline events
	useEffect(() => {
		// Define handlers for online and offline events
		const onlineHandler = () => {
			// Set isOnline to true when online event is triggered
			setIsOnline(true);
		};

		const offlineHandler = () => {
			// Set isOnline to false when offline event is triggered
			setIsOnline(false);
		};

		// Add event listeners for online and offline events
		window.addEventListener("online", onlineHandler);
		window.addEventListener("offline", offlineHandler);

		// Return a cleanup function to remove event listeners when the component unmounts
		return () => {
			window.removeEventListener("online", onlineHandler);
			window.removeEventListener("offline", offlineHandler);
		};
	}, []);

	// Return the current isOnline state
	return isOnline;
}
