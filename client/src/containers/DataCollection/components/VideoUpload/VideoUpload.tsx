import React, { useState } from "react";
import { Upload, message, Space, Button } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface VideoUploadProps {
  videoInfo: any;
  setVideoInfo: any;
  uploadedVideo: any;
  setUploadedVideo: any;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  videoInfo,
  setVideoInfo,
  uploadedVideo,
  setUploadedVideo,
}) => {
  const { t, i18n } = useTranslation();
  const [uploading, setUploading] = useState<boolean>(false);

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

  const handleRemove = () => {
    setUploadedVideo(null);
    setVideoInfo(null);
  };

  return (
    <div>
      {videoInfo ? (
        <Space>
          <p>
            <span>{uploadedVideo}</span>
          </p>
          <span onClick={handleRemove}>
            <CloseOutlined />
          </span>
        </Space>
      ) : (
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
          <Button
            icon={<UploadOutlined />}
            size="large"
            loading={uploading}
            style={{ width: "175px", height: "40px" }}
          >
            {uploading ? t("uploading") : t("choose_a_video")}
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default VideoUpload;
