import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This function takes an array of class names and merges them into a single string
// using the `clsx` function from the `clsx` library
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// This function takes a `File` object and returns a Promise that resolves with the base64
// encoded data of the file
export function getBase64(file: File) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

// This function takes a base64 encoded string and converts it to a Uint8Array
export function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

// This function takes a data URI and converts it to a Blob object
export function dataURItoBlob(dataURI: string) {
	const byteString = atob(dataURI.split(",")[1]);
	const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
	const ab = new ArrayBuffer(byteString.length);
	const la = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		la[i] = byteString.charCodeAt(i);
	}
	const blob = new Blob([ab], { type: mimeString });
	return blob;
}
