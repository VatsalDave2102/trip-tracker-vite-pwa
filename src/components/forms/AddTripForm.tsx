import * as z from "zod";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getBase64 } from "@/lib/utils";
import { addTripFormSchema } from "@/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import WebCamCapture from "@/components/forms/WebCamCapture";
import GetLocationButton from "@/components/forms/GetLocationButton";

const AddTripForm = () => {
	// Get the navigate function from react-router-dom
	const navigate = useNavigate();

	// Initialize the media stream and location availability states
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isLocationAvailable, setIsLocationAvailable] = useState(false);

	// Initialize the media stream when the component mounts
	useEffect(() => {
		const initializeMedia = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				setStream(stream);
			} catch (error) {
				console.error("Error accessing media devices", error);
			}
		};

		const initializeLocation = () => {
			// Check if geolocation is available in the navigator
			if ("geolocation" in navigator) {
				setIsLocationAvailable(true);
			}
		};

		initializeMedia();
		initializeLocation();
	}, []);

	// Initialize the form with default values
	const form = useForm<z.infer<typeof addTripFormSchema>>({
		resolver: zodResolver(addTripFormSchema),
		defaultValues: {
			title: "",
			location: "",
			description: "",
			image: undefined,
			startDate: new Date(),
			endDate: new Date(),
		},
	});

	// Get the form control, state, and reset functions
	const { handleSubmit, control, formState, reset, setValue } = form;

	// Handle image capture from the webcam
	const onCapture = (imageData: Blob) => {
		setValue("image", imageData);
	};

	// Handle location selection
	const onGetLocation = (location: string) => {
		setValue("location", location);
	};

	// Handle form submission
	const onSubmit = async (values: z.infer<typeof addTripFormSchema>) => {
		// Convert the image to base64url
		const base64Image = await getBase64(values.image);
		const tripData = JSON.stringify({
			...values,
			id: uuidv4(),
			image: base64Image,
		});

		// Post the trip data to the server
		try {
			const url = `${import.meta.env.VITE_BACKEND_URL}/postTripData`;
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: tripData,
			});

			if (response.ok) {
				// Reset the form and navigate to the trips page on success
				reset();
				navigate("/trips");
			}
		} catch (error) {
			// Display an error message on failure
			toast({
				title: "Failed to store post",
				description: "Will sync later in background",
				variant: "destructive",
			});
			console.log(error);
		}
	};

	return (
		<div className="pb-4">
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{/* Image field */}
					{stream ? (
						<WebCamCapture onCapture={onCapture} stream={stream} />
					) : (
						<FormField
							control={control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image</FormLabel>
									<FormControl>
										<Input
											placeholder="image"
											onChange={(e) => {
												return field.onChange(e.target.files![0]);
											}}
											type="file"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{/* Title field */}
					<div className="flex flex-col md:flex-row gap-4">
						<FormField
							control={control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Enter title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Location field */}
						<FormField
							control={control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<div className="flex gap-x-3">
										<FormControl>
											<Input placeholder="Enter location" {...field} />
										</FormControl>
										{isLocationAvailable ? (
											<GetLocationButton onGetLocation={onGetLocation} />
										) : null}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Description field */}
					<FormField
						control={control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder="Enter description" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Date fields*/}
					<div className="flex flex-col md:flex-row gap-4">
						<FormField
							control={control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Start date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="endDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>End date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Submit button */}
					<Button
						className="bg-green-900 text-white hover:bg-green-900/90 transition"
						disabled={formState.isSubmitting}
					>
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default AddTripForm;
