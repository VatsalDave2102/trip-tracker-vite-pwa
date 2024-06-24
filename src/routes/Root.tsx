import { Outlet } from "react-router-dom";

import Navbar from "@/components/navbar/Navbar";
export let installPrompt: Event | null;

const Root = () => {
	return (
		<div>
			<Navbar />
			<Outlet />
		</div>
	);
};

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPrompt = e;
});

export default Root;
