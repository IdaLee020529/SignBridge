// VideoInput.tsx
import React, { useState, useEffect } from "react";
import { Upload, Button, message, Space } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import "./VideoInput.css";

interface VideoInputProps {
  reset: boolean;
  onReset: () => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ reset, onReset }) => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (reset) {
      setUploadedVideo(null);
      onReset(); // Notify parent component that the reset is completed
    }
  }, [reset, onReset]);

  const handleChange = (info: any) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setUploadedVideo(info.file.name); // Set the uploaded video name
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      setUploadedVideo(null); // Reset uploaded video name on error
    }
  };

  const handleRemove = () => {
    setUploadedVideo(null);
  };

  return (
    <div className="videoinput-class">
      <Upload
        name="video"
        action="/upload/video"
        onChange={handleChange}
        maxCount={1}
        accept=".mp4"
        showUploadList={false}
        beforeUpload={() => {
          setUploading(true);
          return true;
        }}
        customRequest={({ file, onSuccess, onError }) => {
          setTimeout(() => {
            onSuccess?.("ok");
            setUploading(false);
          }, 1000);
        }}
      >
        <Button icon={<UploadOutlined />} size="large" loading={uploading}>
          {uploading ? "Uploading" : "Choose a Video"}
        </Button>
      </Upload>
      {uploadedVideo && (
        <Space>
          <p>
            {/* <span className="uploaded-text">Uploaded Video:</span>{" "} */}
            <span className="uploaded-text">{uploadedVideo}</span>
          </p>
          <span onClick={handleRemove} className="close-outline-button">
            <CloseOutlined />
          </span>
        </Space>
      )}
    </div>
  );
};

export default VideoInput;
