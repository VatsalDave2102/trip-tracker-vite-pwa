import { Menu } from "lucide-react";

import useOnline from "@/hooks/useOnline";
import Navlink from "@/components/navbar/Navlink";
import { Button } from "@/components/ui/button";
import useNotification from "@/hooks/useNotification";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NavMobileToggle = () => {
	const isOnline = useOnline();
	const { permissionStatus, askForNotificationPermission } = useNotification();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="text-green-900" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="gap-0">
				<div className="flex flex-col md:hidden">
					<ul className="flex flex-col items-center gap-y-4">
						<li>
							<Navlink href="/" name="Home" />
						</li>
						<li>
							<Navlink href="/trips" name="Trips" />
						</li>
						<li>
							<Navlink href="/add-trip" name="Add trip" />
						</li>
						{"Notification" in window && !permissionStatus && (
							<li>
								<Button
									className=" bg-green-900 text-white hover:bg-green-900/90  rounded transition"
									onClick={askForNotificationPermission}
								>
									Enable notifications
								</Button>
							</li>
						)}
						{isOnline ? (
							<li>
								<div className="rounded-full bg-green-500 mx-2 px-2 text-sm text-white py-1">
									Online
								</div>{" "}
							</li>
						) : (
							<li>
								<div className="rounded-full bg-red-500 mx-2 px-2 text-sm text-white py-1">
									Offline
								</div>
							</li>
						)}
					</ul>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default NavMobileToggle;
