import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Trip } from "@/types";
import { Button } from "@/components/ui/button";
import { readAllData, writeData } from "@/lib/indexDb";

export const Trips = () => {
	// Initialize state to store the list of trips
	const [trips, setTrips] = useState<Trip[]>([]);

	// Effect to fetch trips from URL and store them in IndexedDB
	useEffect(() => {
		let networkDataReveived = false;

		// Function to fetch trips from URL
		async function getTrips() {
			const baseUrl = import.meta.env.VITE_DATABASE_URL;
			try {
				const response = await fetch(`${baseUrl}/trips.json`);

				// Parse response data
				const trips = await response.json();
				networkDataReveived = true;
				const dataArray = [];
				for (const key in trips) {
					dataArray.push(trips[key]);
				}

				// Update state with fetched trips
				setTrips(dataArray);
				// Store trips in IndexedDB
				writeData("trips", dataArray);
			} catch (error) {
				console.error(error);
			}
		}

		// Fetch trips from URL
		getTrips();

		// If IndexedDB is available, fetch trips from it
		if ("indexedDB" in window) {
			console.log("reading from index db");
			readAllData("trips").then((data) => {
				if (!networkDataReveived) {
					setTrips(data);
				}
			});
		}
	}, []);

	return (
		<div className="container">
			<div className="flex items-center justify-between my-4">
				<h1 className="text-2xl md:text-3xl 2xl:text-4xl font-bold text-green-900">
					All trips
				</h1>
				<Link to={"/add-trip"}>
					<Button className="bg-green-900 hover:bg-green-900/90 text-white transition">
						Add trip
					</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4 content-stretch">
				{trips.map((trip) => (
					<Link key={trip.id} to={`/trips/${trip.id}`}>
						<Card>
							<CardHeader>
								<CardTitle>{trip.title}</CardTitle>
								<CardDescription className="text-wrap truncate max-h-[60px]">
									{trip.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[240px] w-full">
									<img
										src={trip.imageUrl}
										className="rounded-md object-cover w-full h-full"
									/>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
};
