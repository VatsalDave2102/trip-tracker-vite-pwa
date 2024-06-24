import { ErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
	const error = useRouteError() as ErrorResponse;
	return (
		<div id="error-page" className="flex flex-col gap-4 items-center container">
			<h1 className="text-3xl font-bold">Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error.statusText}</i>
			</p>
		</div>
	);
};

export default ErrorPage;
