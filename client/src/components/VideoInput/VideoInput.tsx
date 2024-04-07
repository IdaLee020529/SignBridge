import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./VideoInput.css";

const VideoInput: React.FC = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

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

  return (
    <div className="videoinput-class">
      <Upload
        name="video"
        action="/upload/video"
        onChange={handleChange}
        maxCount={1}
        accept=".mp4"
      >
        <Button icon={<UploadOutlined />} size="large">
          Choose a Video
        </Button>
      </Upload>
    </div>
  );
};

export default VideoInput;
