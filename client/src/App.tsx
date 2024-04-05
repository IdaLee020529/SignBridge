import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./containers/Home/Home";
import Library from "./containers/Library/Library";
import Communication from "./containers/Communication/Communication";
import Education from "./containers/Education/Education";
import DataCollection from "./containers/DataCollection/Public/DataCollection";
import Feedback from "./containers/Feedback/Feedback";
import Faq from "./containers/Faq/Faq";
import Notification from "./containers/Notification/Notification";
import Login from "./containers/Login/Login";
import SignUp from "./containers/SignUp/SignUp";
import ForgotPassword from "./containers/Login/ForgotPwd/ForgotPassword";
import ResetPassword from "./containers/Login/ResetPwd/ResetPassword";
import { useEffect } from "react";
import { gapi } from "gapi-script";
import HomeLayout from "./HomeLayout";
import ForgotResetPasswordLayout from "./ForgotResetPasswordLayout";
import { Toaster } from "react-hot-toast";
import GuessTheWord from "./containers/Education/Game/GuessTheWord";
import DoTheSign from "./containers/Education/Game/DoTheSign";

function App() {
	const clientId = "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";
	const location = useLocation();

  useEffect(() => {
    function initGapi() {
      gapi.client.init({
        clientId: clientId,
        scope: "email profile",
      });
    }
    gapi.load("client:auth2", initGapi);
  });

  useEffect(() => {
	if (location.pathname !== "/education" && location.pathname !== "/guess-the-word" && location.pathname !== "/do-the-sign") {
		console.log("App.tsx: useEffect: window.window.location.pathname !== /education, /guess-the-word, /do-the-sign");
		const localVolumeValue = localStorage.getItem("volumeValue");
		if (localVolumeValue) {
			localStorage.setItem("volumeValue", "100");
		}
	}
}, [location.pathname]);

return (
    <>
      <Toaster />
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/education" element={<Education />} />
            <Route path="/dataset-collection" element={<DataCollection />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/guess-the-word" element={<GuessTheWord />} />
            <Route path="/do-the-sign" element={<DoTheSign />} />
          </Route>
          <Route element={<ForgotResetPasswordLayout />}>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
    </>
  );
}

export default App;
