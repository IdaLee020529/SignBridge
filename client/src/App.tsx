import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function App() {
  const clientId =
    "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

  useEffect(() => {
    function initGapi() {
      gapi.client.init({
        clientId: clientId,
        scope: "email profile",
      });
    }
    gapi.load("client:auth2", initGapi);
  });

  return (
    <>
      <Toaster />
      <Router>
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
          </Route>
          <Route element={<ForgotResetPasswordLayout />}>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
