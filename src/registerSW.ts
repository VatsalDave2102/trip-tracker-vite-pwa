export default function registerSW() {
	window.addEventListener("load", () => {
		if ("serviceWorker" in navigator) {
			console.log(import.meta.env.MODE);

			const swUrl =
				import.meta.env.MODE === "production"
					? "/sw.js"
					: "/dev-/ sw.js?dev-sw";

			navigator.serviceWorker.register(swUrl, { scope: "/", type: "module" });
		}
	});
}
