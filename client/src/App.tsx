import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./containers/Home/Home";
import Library from "./containers/Library/Library";
import Communication from "./containers/Communication/Communication";
import Education from "./containers/Education/Education";
import DataCollectionPublic from "./containers/DataCollection/Public/DataCollectionPublic";
import DatasetReviewAdmin from "./containers/DataCollection/Admin/DatasetReviewAdmin";
import DatasetReviewSE from "./containers/DataCollection/SignExpert/DatasetReviewSE/DatasetReviewSE";
import DatasetCollectionSE from "./containers/DataCollection/SignExpert/DatasetCollection/DatasetCollectionSE";
import Feedback from "./containers/Feedback/Feedback";
import Faq from "./containers/Faq/Faq";
import Notification from "./containers/Notification/Notification";
import Login from "./containers/Login/Login";
import SignUp from "./containers/SignUp/SignUp";
import ForgotPassword from "./containers/Login/ForgotPwd/ForgotPassword";
import ResetPassword from "./containers/Login/ResetPwd/ResetPassword";
import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import HomeLayout from "./HomeLayout";
import ForgotResetPasswordLayout from "./ForgotResetPasswordLayout";
import { Toaster } from "react-hot-toast";
import GuessTheWord from "./containers/Education/Game/GuessTheWord";
import DoTheSign from "./containers/Education/Game/DoTheSign";
// import DataCollectionReview from "./containers/DataCollection/Admin/DataCollectionReview";
import FeedbackAdmin from "./containers/Feedback/Admin/FeedbackAdmin";
import FeedbackSuccess from "./containers/Feedback/FeedbackSuccess";
import FaqAdmin from "./containers/Faq/Admin/FaqAdmin";
import ProfilePage from "./containers/ProfilePage/ProfilePage";
import LibraryAdmin from "./containers/Library/Admin/LibraryAdmin";
import Cookies from "js-cookie";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./i18n";

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
});

function App() {
  const clientId =
    "52594958094-08qvrugskhjjv34jA4h0oi4m2ognjg830.apps.googleusercontent.com";
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
  

  const [feedbackComponent, setFeedbackComponent] = useState<React.ReactNode>();
  useEffect(() => {
    const roleAccess = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role_access="))
      ?.split("=")[1];

    switch (roleAccess) {
      case "admin":
        setFeedbackComponent(<FeedbackAdmin />);
        break;
      case "signexpert":
        setFeedbackComponent(<Feedback />);
        break;
      default:
        setFeedbackComponent(<Feedback />);
        break;
    }
  }, [location.pathname]);

  const [faqComponent, setFaqComponent] = useState<React.ReactNode>(<Faq />);
  useEffect(() => {
    const roleAccess = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role_access="))
      ?.split("=")[1];

    switch (roleAccess) {
      case "admin":
        setFaqComponent(<FaqAdmin />);
        break;
      case "signexpert":
        setFaqComponent(<Faq />);
        break;
      default:
        setFaqComponent(<Faq />);
        break;
    }
  }, [location.pathname]);

  const [datasetComponent, setDatasetComponent] = useState<React.ReactNode>(
    <DataCollectionPublic />
  );
  const [datasetReviewComponent, setDatasetReviewComponent] =
    useState<React.ReactNode>();
  useEffect(() => {
    const roleAccess = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role_access="))
      ?.split("=")[1];

    switch (roleAccess) {
      case "admin":
        setDatasetComponent(<DatasetReviewAdmin />);
        break;
      case "signexpert":
        setDatasetComponent(<DatasetCollectionSE />);
        setDatasetReviewComponent(<DatasetReviewSE />);
        break;
      default:
        setDatasetComponent(<DataCollectionPublic />);
        break;
    }
  }, [location.pathname]);

  const [libraryComponent, setLibraryComponent] = useState<React.ReactNode>();
  useEffect(() => {
    const roleAccess = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role_access="))
      ?.split("=")[1];

    switch (roleAccess) {
      case "admin":
        setLibraryComponent(<LibraryAdmin />);
        break;
      case "signexpert":
        setLibraryComponent(<Library />);
        break;
      default:
        setLibraryComponent(<Library />);
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname !== "/education" &&
      location.pathname !== "/guess-the-word" &&
      location.pathname !== "/do-the-sign"
    ) {
      console.log(
        "App.tsx: useEffect: window.window.location.pathname !== /education, /guess-the-word, /do-the-sign"
      );
      const localVolumeValue = localStorage.getItem("volumeValue");
      if (localVolumeValue) {
        localStorage.setItem("volumeValue", "100");
      }
    }

    if (location.pathname !== "/guess-the-word") {
      sessionStorage.removeItem("guessLives");
      sessionStorage.removeItem("guessCurrentLevel");
      sessionStorage.removeItem("guessQuestionList");
      sessionStorage.removeItem("guessScore");
    }

    if (location.pathname !== "/do-the-sign") {
      sessionStorage.removeItem("doTheSignCurrentLevel");
      sessionStorage.removeItem("doTheSignScore");
      sessionStorage.removeItem("doTheSignHintUsedCount");
      sessionStorage.removeItem("animationKeyword");
    }
  }, [location.pathname]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={libraryComponent} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/education" element={<Education />} />
          <Route path="/dataset-collection" element={datasetComponent} />
          <Route
            path="/dataset-collection-review"
            element={datasetReviewComponent}
          />
          <Route path="/feedback" element={feedbackComponent} />
          <Route path="/faq" element={faqComponent} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/guess-the-word" element={<GuessTheWord />} />
          <Route path="/do-the-sign" element={<DoTheSign />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route element={<ForgotResetPasswordLayout />}>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/feedback-success" element={<FeedbackSuccess />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
