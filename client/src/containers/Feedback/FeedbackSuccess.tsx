import style from "./FeedbackSuccess.module.css";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use-size";

const FeedbackSuccess = () => {
  const { width, height } = useWindowSize();

  return (
    <>
      <Confetti width={width} height={height} />
      <div className={style.feedbackSuccess}>
        <div className={style.feedbackSuccessContainer}>
          <h1>Thank you for your feedback!</h1>
          <p>
            Your feedback is important to us. We will use it to improve our
            services.
          </p>
          <button onClick={() => window.location.replace("/")}>
            <i className="fa-solid fa-arrow-left"></i> Back to our website
          </button>
        </div>
      </div>
    </>
  );
};

export default FeedbackSuccess;
