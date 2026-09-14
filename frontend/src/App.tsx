import "./index.css";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { router } from "./routes";
import AuthInitializer from "./modules/auth/components/AuthInitializer";

const App = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.BUN_PUBLIC_GOOGLE_CLIENT_ID!}
    >
      <AuthInitializer />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
};

export default App;
