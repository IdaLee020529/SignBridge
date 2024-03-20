import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import './index.css'

// const id = "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";
const id = "418316593627-msh2g7u8uo8mbh3d78l867veooa7ucjn.apps.googleusercontent.com"; // 这是 Hon 的 testing client id

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId={id}>
			<App />
		</GoogleOAuthProvider>
	</React.StrictMode>,
);
