import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const VideoInput: React.FC = () => {
  const handleChange = (info: any) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Upload
      name="video"
      action="/upload/video"
      onChange={handleChange}
      maxCount={1}
      accept=".mp4"
    >
      <Button style={{ fontSize: 15 }} icon={<UploadOutlined />}>
        Upload a Video
      </Button>
    </Upload>
  );
};

export default VideoInput;
