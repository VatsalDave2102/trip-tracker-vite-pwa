import { Outlet } from "react-router-dom";

import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
export let installPrompt: Event | null;

const Root = () => {
	return (
		<div>
			<Navbar />
			<Outlet />
			<Toaster />
		</div>
	);
};

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPrompt = e;
});

export default Root;
