import { toast } from "@/components/ui/use-toast";
import { readAllData } from "@/lib/indexDb";
import { Trip } from "@/types";
import { useEffect, useState } from "react";

export default function useTrip(tripId: string) {
	const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	useEffect(() => {
		async function fetchTrip() {
			try {
				const dbTrips = await readAllData("trips");
				const dbTrip = dbTrips.find((trip) => trip.id === tripId);
				if (dbTrip) {
					console.log("trip found in idb");
					setCurrentTrip(dbTrip);
				}

				const url = `${import.meta.env.VITE_DATABASE_URL}/trips/${tripId}.json`;
				const response = await fetch(url);
				if (response.ok) {
					const networkTrip = await response.json();
					setCurrentTrip(networkTrip);
				}
			} catch (error) {
				toast({ title: "Fetch failed", description: "Trip does not exist" });
				setIsError(true);
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}

		console.log("transition started");
		fetchTrip();
	}, [tripId]);

	return [isLoading, isError, currentTrip] as [boolean, boolean, Trip];
}
