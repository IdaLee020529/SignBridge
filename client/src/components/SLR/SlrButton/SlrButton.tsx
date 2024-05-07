import './SlrButton.css';
import React, { useRef, useState } from 'react';

const mimeType = 'video/webm; codecs="opus,vp8"';

const SlrButton = ({
    onBrowseVideo,
    onStartRecording,
    onStopRecording,
}: {
    onBrowseVideo: (video: File) => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
}) => {
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const liveVideoFeed = useRef<HTMLVideoElement>(null);
    const [permission, setPermission] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState<"inactive" | "recording">("inactive");
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
    const [videoChunks, setVideoChunks] = useState<Blob[]>([]);

    const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = e.target.files && e.target.files[0];
        if (video) {
            setSelectedVideo(video);
            onBrowseVideo(video);
        }
    };

    const getCameraPermission = async () => {
        setRecordedVideo(null);
        try {
            const videoConstraints = { audio: false, video: true };
            const combinedStream = await navigator.mediaDevices.getUserMedia(videoConstraints);
            setStream(combinedStream);
            setPermission(true);
        } catch (error) {
            alert("Error getting camera permission: " + (error as Error).message);
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        onStartRecording?.(); // Callback on starting countdown timer in parent component

        if (stream) {
            const media = new MediaRecorder(stream, { mimeType });
            mediaRecorder.current = media;
            let localVideoChunks: Blob[] = [];

            media.ondataavailable = (e) => {
                if (e.data.size) {
                    localVideoChunks.push(e.data);
                }
            };

            media.onstop = () => {
                const videoBlob = new Blob(localVideoChunks, { type: mimeType });
                const videoUrl = URL.createObjectURL(videoBlob);
                setRecordedVideo(videoUrl);
            };

            media.start();
            setVideoChunks(localVideoChunks);
        } else {
            alert("Stream is null");
        }
    };

    const stopRecording = () => {
        onStopRecording?.(); // Callback on stopping countdown timer in parent component
        setPermission(false);
        setRecordingStatus("inactive");
        mediaRecorder.current?.stop();
    };

    const handleUpload = async () => {
        if (recordedVideo) {
            try {
                const formData = new FormData();
                formData.append("video", recordedVideo);

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
                console.error("Error sending video to server: ", error);
            }
        } else {
            console.error("No recorded video to upload");
        }
    };

    return (
        <div className="slr-btn-menu">
            {/* Browse Video File Button */}
            <input
                type="file"
                ref={videoInputRef}
                style={{ display: "none" }}
                accept=".mp4"
                onChange={handleVideoInputChange}
            />
            <button className="slr-btn" onClick={() => videoInputRef.current?.click()}>
                <i className="fa fa-file-video-o"></i>
            </button>

            {!permission && (
                <button className="slr-btn" onClick={getCameraPermission} type="button">
                    <i className="fa fa-video"></i>
                </button>
            )}

            {permission && recordingStatus === "inactive" && (
                <button className="slr-btn" onClick={startRecording} type="button">
                    <i className="fa fa-play"></i>
                </button>
            )}

            {permission && recordingStatus === "recording" && (
                <button className="slr-btn" onClick={stopRecording} type="button">
                    <i className="fa fa-stop"></i>
                </button>
            )}

            {!recordedVideo && (
                <video
                    ref={liveVideoFeed}
                    className="slr-preview-video"
                    autoPlay
                    muted
                    playsInline
                ></video>
            )}

            {recordedVideo && (
                <video
                    className="slr-preview-video"
                    controls
                    autoPlay
                    muted
                    playsInline
                    src={recordedVideo}
                ></video>
            )}

            <button className="slr-btn" onClick={handleUpload} type="button">
                <i className="fa fa-upload"></i>
            </button>
        </div>
    );
};

export default SlrButton;
