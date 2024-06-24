import useTrip from "@/hooks/useTrip";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

export const Trip = () => {
	// Get trip ID from URL parameters
	const { tripId } = useParams();
	// Fetch trip data using the `useTrip` hook
	const [isPending, isError, trip] = useTrip(tripId as string);

	// Display loader while trip data is being fetched
	if (isPending) {
		return (
			<div className="container">
				<Loader className="text-2xl md:text-3xl text-green-900 animate-spin mx-auto my-4" />
			</div>
		);
	}

	// Display error message if trip data fetch fails
	if (isError) {
		return (
			<div className="container">
				<h1 className="text-2xl md:text-3xl text-green-900">Trip not found</h1>
			</div>
		);
	}

	// Display trip details
	return (
		<div className="container space-y-3">
			{/* Trip header */}
			<div className="my-4 header">
				<h1 className="text-2xl md:text-3xl font-semibold text-green-900">
					{trip.title}
				</h1>
			</div>
			{/* Trip location */}
			<div>
				<p className="text-gray-700">Location: {trip.location}</p>
			</div>
			{/* Trip description */}
			<div>
				<p className="text-gray-700 truncate">
					Description: {trip.description}
				</p>
			</div>
			{/* Trip dates */}
			<div className="flex gap-x-4">
				<p className="text-gray-700">From: {format(trip.startDate, "PPP")}</p>
				<p className="text-gray-700">To: {format(trip.endDate, "PPP")}</p>
			</div>
			<div className="w-full md:w-3/5 mx-auto">
				<img
					src={trip.imageUrl}
					alt={trip.title}
					className="w-full object-cover"
				/>
			</div>
		</div>
	);
};
