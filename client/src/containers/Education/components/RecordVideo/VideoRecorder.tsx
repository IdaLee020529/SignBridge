import { useState, useRef } from "react";
import "./VideoRecorder.css";
import buttonClickedSound from "/music/btnClicked.wav";

const mimeType = 'video/webm; codecs="opus,vp8"';

// Function to play button clicked sound
const playButtonClickedSound = () => {
  const audio = new Audio(buttonClickedSound);
  audio.play();
};

const VideoRecorder = ({
  onStartRecording,
  onStopRecording,
}: {
  onStartRecording: () => void;
  onStopRecording: () => void;
}) => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const liveVideoFeed = useRef<HTMLVideoElement>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    //get video and audio permissions and then stream the result media stream to the videoSrc variable
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: false,
          video: true,
        };
        const audioConstraints = { audio: true };

        // create audio and video streams separately
        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );

        setPermission(true);

        //combine both audio and video streams

        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);

        setStream(combinedStream);

        //set videostream to live feed player
        if (liveVideoFeed.current) {
          liveVideoFeed.current.srcObject = videoStream;
        }
      } catch (err) {
        alert((err as Error).message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    if (onStartRecording) {
      onStartRecording(); // Callback to start countdown timer in parent component
    }

    if (stream) {
      // Ensure stream is not null
      const media = new MediaRecorder(stream, { mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();
      let localVideoChunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localVideoChunks.push(event.data);
      };

      setVideoChunks(localVideoChunks);
    } else {
      console.error("Stream is null. Cannot start recording.");
    }
  };

  const stopRecording = () => {
    if (onStopRecording) {
      onStopRecording(); // Callback to stop countdown timer in parent component
    }

    setPermission(false);
    setRecordingStatus("inactive");
    mediaRecorder.current?.stop();

    if (mediaRecorder.current) {
      mediaRecorder.current.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);

        setRecordedVideo(videoUrl);

        setVideoChunks([]);
      };
    }
  };

  return (
    <div>
      <main>
        <div className="video-controls">
          {!permission ? (
            <button
              className="open-cam-btn-pushable"
              onClick={() => {
                getCameraPermission();
                playButtonClickedSound();
              }}
              type="button"
            >
              <span className="open-cam-btn-shadow"></span>
              <span className="open-cam-btn-edge"></span>
              <span className="open-cam-btn-front text">
                <i className="fa fa-video"></i>
              </span>
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button
              className="open-cam-btn-pushable"
              onClick={() => {
                startRecording();
                playButtonClickedSound();
              }}
              type="button"
            >
              <span className="open-cam-btn-shadow"></span>
              <span className="open-cam-btn-edge"></span>
              <span className="open-cam-btn-front text">
                <i className="fa fa-play"></i>
              </span>
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button
              className="open-cam-btn-pushable"
              onClick={() => {
                stopRecording();
                playButtonClickedSound();
              }}
              type="button"
            >
              <span className="open-cam-btn-shadow"></span>
              <span className="open-cam-btn-edge"></span>
              <span className="open-cam-btn-front text">
                <i className="fa fa-stop"></i>
              </span>
            </button>
          ) : null}
        </div>
      </main>

      <div className="video-player">
        {!recordedVideo ? (
          <video
            ref={liveVideoFeed}
            autoPlay
            className={`live-player ${!permission ? "initial-height" : ""}`}
          ></video>
        ) : null}
        {recordedVideo ? (
          <div className="recorded-player">
            <video className="recorded" src={recordedVideo} controls></video>
            <button
              className="upload-btn-pushable"
              type="button"
            >
              <span className="upload-btn-shadow"></span>
              <span className="upload-btn-edge"></span>
              <span className="upload-btn-front text">
                <i className="fa fa-upload"><a download href={recordedVideo}>Upload</a></i>
              </span>
            </button>

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VideoRecorder;
