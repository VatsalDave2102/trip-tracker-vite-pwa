import AddTripForm from "@/components/forms/AddTripForm";

export const AddTrip = () => {
	return (
		<div className="container">
			<div className="my-4">
				<h1 className="text-2xl md:text-3xl font-bold text-green-900">
					Fill trip details
				</h1>
			</div>
			<AddTripForm />
		</div>
	);
};
