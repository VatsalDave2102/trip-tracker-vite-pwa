import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

import LANDSCAPE from "/src/assets/images/landscape.webp";
import BEACH from "/src/assets/images/beach.webp";
import WATERFALL from "/src/assets/images/waterfall.webp";
import FIREWORKS from "/src/assets/images/fireworks.webp";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { installPrompt } from "@/routes/Root";
import { Button } from "@/components/ui/button";
import { askForInstallation } from "@/lib/swUtils";

const carouselImages = [
	{
		alt: "Landscape",
		src: LANDSCAPE,
	},
	{
		alt: "Beach",
		src: BEACH,
	},
	{
		alt: "Waterfall",
		src: WATERFALL,
	},
	{ alt: "Fireworks", src: FIREWORKS },
];

export const Home = () => {
	return (
		// home page banner
		<div>
			<div className="py-8 bg-gray-200">
				<h1 className="text-center text-3xl lg:text-5xl font-bold text-green-900">
					Start collecting your memories
				</h1>
			</div>
			<div className="w-full px-10 py-4">
				<Carousel
					opts={{ align: "start", loop: true }}
					plugins={[Autoplay({ delay: 4000 })]}
				>
					<CarouselContent>
						{carouselImages.map((image) => (
							<CarouselItem className="md:basis-1/2 rounded-xl" key={image.alt}>
								<img
									src={image.src}
									alt={image.alt}
									className="lg:h-[512px] md:h-[384px] h-[256px] w-full object-cover rounded-xl"
								/>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
			<div className="flex justify-center gap-x-4 my-4">
				<Button className="bg-green-900 hover:bg-green-900/90 text-white transition">
					<Link to={"/trips"}>Your trips</Link>
				</Button>
				<Button
					className="bg-green-900 hover:bg-green-900/90 text-white transition"
					onClick={() => askForInstallation(installPrompt)}
				>
					<Link to={"/add-trip"}>Add new trip</Link>
				</Button>
			</div>
		</div>
	);
};
