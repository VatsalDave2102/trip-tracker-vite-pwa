import { useEffect, useRef, useState } from "react";

import { dataURItoBlob } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WebCamCaptureProps {
	onCapture: (blob: Blob) => void;
	stream: MediaStream;
}

const WebCamCapture = ({ onCapture, stream }: WebCamCaptureProps) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [showCanvas, setShowCanvas] = useState(false);

	// Set up the video element with the media stream
	useEffect(() => {
		const video = videoRef.current;
		if (video && stream) {
			video.srcObject = stream;
			video.style.display = "block";
		}

		// Clean up the video tracks when the component is unmounted
		return () => {
			if (video && video.srcObject === stream) {
				video.srcObject.getVideoTracks().forEach((track) => track.stop());
			}
		};
	}, [stream]);

	// Capture the image from the video element
	const captureImage = () => {
		const video = videoRef.current;
		const canvas = canvasRef.current;

		if (canvas && video) {
			const context = canvas.getContext("2d");
			canvas.style.display = "block";
			video.style.display = "none";
			setShowCanvas(true);

			// Draw the video frame onto the canvas
			context?.drawImage(
				video,
				0,
				0,
				canvas.width,
				video.videoHeight / (video.videoWidth / canvas.width)
			);

			// Stop the video tracks and convert the canvas to a blob
			if (video.srcObject === stream) {
				video.srcObject.getVideoTracks().forEach((track) => track.stop());
				const picture = dataURItoBlob(canvas.toDataURL());
				onCapture(picture);
			}
		}
	};
	return (
		<div className="flex flex-col justify-center items-center">
			{!showCanvas && (
				<>
					<video autoPlay ref={videoRef} />
					<Button
						type="button"
						className="bg-green-900 text-white hover:bg-green-900/90 mt-5"
						onClick={captureImage}
					>
						Capture
					</Button>
				</>
			)}
			<canvas ref={canvasRef} width={"320px"} height={"240px"}></canvas>
		</div>
	);
};

export default WebCamCapture;
