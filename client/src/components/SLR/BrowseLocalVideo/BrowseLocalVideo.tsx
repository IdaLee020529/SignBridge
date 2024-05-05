// BrowseLocalVideo.tsx
import React, { useState, useEffect } from "react";
import { Upload, Button, message, Space } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import "./BrowseLocalVideo.css";
import { useTranslation } from "react-i18next";

// Component to browse the local video file
interface BrowseLocalVideoProps {
  reset: boolean;
  onReset: () => void;
  setVideoInfo: any;
}

const BrowseLocalVideo: React.FC<BrowseLocalVideoProps> = ({
  reset,
  onReset,
  setVideoInfo,
}) => {
  // State Hooks
  const { t, i18n } = useTranslation();
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Effect Hook for reset
  useEffect(() => {
    if (reset) {
      setUploadedVideo(null);
      onReset(); // Notify parent component that the reset is completed
    }
  }, [reset, onReset]);

  // Handle change in uploaded file
  const handleChange = (info: any) => {
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setUploadedVideo(info.file.name); // Set the uploaded video name
      setVideoInfo(info.file.originFileObj); // Set video info when upload is successful
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      setUploadedVideo(null); // Reset uploaded video name on error
    }
  };

  // Handle remove uploaded video
  const handleRemove = () => {
    setUploadedVideo(null);
    setVideoInfo(null);
  };

  return (
    <div className="BrowseLocalVideo-class">
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
          {uploading ? t("uploading") : t("choose_a_video")}
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

export default BrowseLocalVideo;
