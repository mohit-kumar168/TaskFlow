import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import AuthInitializer from "./modules/auth/components/AuthInitializer";

const App = () => {
	return (
		<>
			<AuthInitializer />
			<RouterProvider router={router} />
		</>
	);
};

export default App;
