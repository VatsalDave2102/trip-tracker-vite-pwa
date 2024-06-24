import { useTransition } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const GetLocationButton = ({
	onGetLocation,
}: {
	onGetLocation: (location: string) => void;
}) => {
	const [isPending, startTransition] = useTransition();

	const onSuccessGeolocation: PositionCallback = async (position) => {
		const cordinates = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};

		const url = `${
			import.meta.env.VITE_LOCATION_BASE_URL
		}/reverse-geocode-client?latitude=${cordinates.lat}&longitude=${
			cordinates.lng
		}&localityLanguage=en`;

		try {
			const response = await fetch(url);
			const fetchedLocation = await response.json();
			if (fetchedLocation.city) {
				onGetLocation(fetchedLocation.city);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onErrorGeolocation: PositionErrorCallback = () => {
		toast({
			title: "Location fetching error",
			description: "Could not fetch location, please enter manually",
			variant: "destructive",
		});
	};

	const getLocation = () => {
		startTransition(() => {
			navigator.geolocation.getCurrentPosition(
				onSuccessGeolocation,
				onErrorGeolocation
			);
		});
	};

	return (
		<>
			{isPending ? (
				<Loader2 className="animate-spin" />
			) : (
				<Button
					type="button"
					className="bg-green-900 text-white hover:bg-green-900/90"
					onClick={getLocation}
				>
					Get Location
				</Button>
			)}
		</>
	);
};
export default GetLocationButton;
