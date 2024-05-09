// SLRInput.tsx
import './SLRInput.css';
import React, { useRef, useState } from 'react';
const mimeType = 'video/webm; codecs="opus,vp8"';

const SLRInput = () => {
    // State variables
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null); // Hold the selected local video file
    const [permission, setPermission] = useState(false); // Camera permission
    const [recordingStatus, setRecordingStatus] = useState<"inactive" | "recording">("inactive"); // Recording status
    const [stream, setStream] = useState<MediaStream | null>(null); // Video stream
    const [recordedVideo, setRecordedVideo] = useState<string | null>(null); // Recorded video
    const [videoChunks, setVideoChunks] = useState<Blob[]>([]); // Recorded video chunks

    // Open camera
    const videoInputRef = useRef<HTMLInputElement>(null); // Video input reference
    const mediaRecorder = useRef<MediaRecorder | null>(null); // Media recorder reference
    const liveVideoFeed = useRef<HTMLVideoElement>(null); // Live video feed reference

    // Handle reset all state variables
    const handleResetAll = () => {
        setSelectedVideo(null); // Reset the selected video
        setPermission(false); // Reset the camera permission
        setRecordingStatus("inactive"); // Reset the recording status
        setStream(null); // Reset the video stream
        setRecordedVideo(null); // Reset the recorded video
        setVideoChunks([]); // Reset the recorded video chunks

        // Stop the media recorder and video stream
        mediaRecorder.current?.stop();

        // Stop the live video feed
        if (liveVideoFeed.current) {
            liveVideoFeed.current.srcObject = null;
        }

        // Stop the video stream
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    };

    // Handle selected video change
    const handleSelectedVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleResetAll();
        const video = event.target.files && event.target.files[0];
        if (video) {
            setSelectedVideo(video);
        }
    };

    // Handle camera permission
    const handleCameraPermission = async () => {
        // Reset all state variables
        handleResetAll();

        // Check if the browser supports the MediaRecorder API
        if ("MediaRecorder" in window) {
            try {
                // Get the video constraints
                const videoConstraints = {
                    video: true
                };

                const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints); // Get the video stream
                setPermission(true); // Set the camera permission to true
                setStream(videoStream); // Set the video stream

                //set videostream to live feed player
                if (liveVideoFeed.current) {
                    liveVideoFeed.current.srcObject = videoStream;
                }
            } catch (error) {
                console.error("Error accessing the camera: ", error);
            }
        } else {
            console.error("MediaRecorder API is not supported in this browser");
        }
    };

    // Start recording
    const handleStartRecording = async () => {
        // Set the recording status to recording
        setRecordingStatus("recording");

        // Check if the video stream is available
        if (stream) {
            const media = new MediaRecorder(stream, { mimeType }); // Create a new media recorder
            mediaRecorder.current = media; // Set the media recorder
            let localVideoChunks: Blob[] = []; // Local video chunks

            // Handle the data available event
            media.ondataavailable = (event) => {
                if (event.data.size) {
                    localVideoChunks.push(event.data);
                }
            };

            // Handle the stop event
            media.onstop = () => {
                const videoBlob = new Blob(localVideoChunks, { type: mimeType });
                const videoUrl = URL.createObjectURL(videoBlob);
                setRecordedVideo(videoUrl);
            };

            media.start(); // Start the media recorder
            setVideoChunks(localVideoChunks); // Set the video chunks
        } else {
            console.error("Video stream is not available");
        }
    };

    // Stop recording
    const handleStopRecording = () => {
        setPermission(false); // Set the camera permission to false
        setRecordingStatus("inactive"); // Set the recording status to inactive
        mediaRecorder.current?.stop(); // Stop the media recorder

        // Stop the video stream
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    };

    // Handle upload
    const handleUpload = async () => {
        // Create a new form data
        const formData = new FormData();

        // Case 1: Using local video file
        if (selectedVideo) {
            formData.append("video", selectedVideo);
        }

        // Case 2: Camera recorded video
        if (recordedVideo) {
            const videoBlob = new Blob(videoChunks, { type: mimeType });
            formData.append("video", videoBlob);
        }

        // If there is a video file, send it to the server
        if (formData.get("video")) {
            try {
                alert("Video uploaded successfully")
                const response = await fetch("http://localhost:5000/api/sentence_SLR", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Video uploaded successfully: ", data);
                } else {
                    console.error("Failed to send video to server");
                }
            } catch (error) {
                console.error("Error sending video to server: ", error)
            }
        } else {
            console.error("No video selected to upload")
        }
    };

    return (
        <div>
            <div className="slr-input-menu">
                <input
                    type="file"
                    ref={videoInputRef}
                    style={{ display: "none" }}
                    accept=".mp4"
                    onChange={handleSelectedVideoChange}
                />
                <button className="slr-input-btn" onClick={() => videoInputRef.current?.click()}>
                    <i className="fa fa-file-video-o"></i>
                </button>

                {!permission && (
                    <button className="slr-input-btn" onClick={handleCameraPermission} type="button">
                        <i className="fa fa-video"></i>
                    </button>
                )}

                {permission && recordingStatus === "inactive" && (
                    <button className="slr-input-btn" onClick={handleStartRecording} type="button">
                        <i className="fa fa-play"></i>
                    </button>
                )}

                {permission && recordingStatus === "recording" && (
                    <button className="slr-input-btn" onClick={handleStopRecording} type="button">
                        <i className="fa fa-stop"></i>
                    </button>
                )}

                <button className="slr-input-btn" onClick={handleResetAll} type="button">
                    <i className="fa fa-refresh"></i>
                </button>

                <button className="slr-input-btn" onClick={handleUpload} type="button">
                    <i className="fa fa-upload"></i>
                </button>
            </div>

            <div className="video-container">
                <video
                    ref={liveVideoFeed}
                    className={`slr-preview-video ${!recordedVideo && !selectedVideo ? 'active' : ''}`}
                    autoPlay
                    muted
                    playsInline
                ></video>
                <video
                    className={`slr-preview-video ${recordedVideo ? 'active' : ''}`}
                    controls
                    autoPlay
                    muted
                    playsInline
                    // @ts-ignore
                    src={recordedVideo}
                ></video>
                <video
                    className={`slr-preview-video ${selectedVideo ? 'active' : ''}`}
                    controls
                    autoPlay
                    muted
                    playsInline
                    src={selectedVideo ? URL.createObjectURL(selectedVideo) : ''}
                ></video>
            </div>
        </div>
    );
};

export default SLRInput;