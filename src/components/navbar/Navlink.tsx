import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navlink = ({ href, name }: { href: string; name: string }) => {
	const location = useLocation();

	return (
		<Button className="p-0">
			<Link
				to={href}
				className={cn(
					"text-gray-500 hover:bg-gray-200 hover:text-gray-800 px-4 py-2 rounded transition",
					location.pathname === href ? "text-black" : ""
				)}
			>
				{name}
			</Link>
		</Button>
	);
};

export default Navlink;
