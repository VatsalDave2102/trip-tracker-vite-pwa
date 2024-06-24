import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import registerSW from "@/registerSW.ts";
import Root from "@/routes/Root.tsx";
import ErrorPage from "@/ErrorPage.tsx";
import { Trip } from "@/routes/Trip.tsx";
import { Home } from "@/routes/Home.tsx";
import { AddTrip } from "@/routes/AddTrip";
import { Trips } from "@/routes/Trips.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/trips",
				element: <Trips />,
			},
			{
				path: "/add-trip",
				element: <AddTrip />,
			},
			{
				path: "trips/:tripId",
				element: <Trip />,
			},
		],
	},
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

// register custom service worker
registerSW();
