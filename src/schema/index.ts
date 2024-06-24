import * as z from "zod";

export const addTripFormSchema = z
	.object({
		title: z
			.string()
			.min(2, { message: "Enter minimum 2 characters" })
			.max(20, { message: "Title can not be more than 20 characters" }),
		location: z.string().min(1, { message: "Location is required" }),
		image: z.custom((value) => {
			if (value instanceof File || value instanceof Blob) {
				return value.type.startsWith("image");
			}
			return false;
		}),
		startDate: z.date({
			errorMap: () => ({ message: "Start date is required" }),
		}),
		endDate: z.date({ errorMap: () => ({ message: "End date is required" }) }),
		description: z.string().min(1, { message: "Description is required" }),
	})
	.refine((data) => data.endDate >= data.startDate, {
		message: "End date must be  after start date",
		path: ["endDate"],
	});
