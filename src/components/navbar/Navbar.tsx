import { Link } from "react-router-dom";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import useOnline from "@/hooks/useOnline";
import tripTrackerImage from "/favicon.svg";
import { Button } from "@/components/ui/button";
import Navlink from "@/components/navbar/Navlink";
import useNotification from "@/hooks/useNotification";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import NavMobileToggle from "@/components/navbar/NavMobileToggle";

const Navbar = () => {
	const isOnline = useOnline();
	const { permissionStatus, askForNotificationPermission } = useNotification();

	return (
		<div className="shadow-md flex justify-between items-center h-14 px-4">
			<div className="flex items-center ">
				<Link to={"/"}>
					<Avatar className="h-14 w-14">
						<AvatarImage src={tripTrackerImage} />
					</Avatar>
				</Link>
				<h1 className="text-xl font-bold text-green-900 sm:text-3xl">
					Trip Tracker
				</h1>
			</div>
			<NavigationMenu className="hidden md:flex">
				<NavigationMenuList>
					<NavigationMenuItem>
						<Navlink href="/" name="Home" />
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Navlink href="/trips" name="Trips" />
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Navlink href="/add-trip" name="Add trip" />
					</NavigationMenuItem>
					{"Notification" in window && !permissionStatus && (
						<NavigationMenuItem>
							<Button
								className=" bg-green-900 text-white hover:bg-green-900/90  rounded transition"
								onClick={askForNotificationPermission}
							>
								Enable notifications
							</Button>
						</NavigationMenuItem>
					)}
					{isOnline ? (
						<NavigationMenuItem>
							<div className="rounded-full bg-green-500 mx-2 px-2 text-sm text-white py-1">
								Online
							</div>{" "}
						</NavigationMenuItem>
					) : (
						<NavigationMenuItem>
							<div className="rounded-full bg-red-500 mx-2 px-2 text-sm text-white py-1">
								Offline
							</div>
						</NavigationMenuItem>
					)}
				</NavigationMenuList>
			</NavigationMenu>
			<NavMobileToggle />
		</div>
	);
};

export default Navbar;
