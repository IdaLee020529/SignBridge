// ImageInput.tsx
import React, { useState, useEffect } from "react";
import { Upload, Button, message, Space } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import "./ImageInput.css"; 

interface ImageInputProps {
  reset: boolean;
  onReset: () => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ reset, onReset }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (reset) {
      setUploadedImage(null);
      onReset(); // Notify parent component that the reset is completed
    }
  }, [reset, onReset]);

  const handleChange = (info: any) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setUploadedImage(info.file.name); // Set the uploaded image name
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      setUploadedImage(null); // Reset uploaded image name on error
    }
  };

  const handleRemove = () => {
    setUploadedImage(null);
  };

  return (
    <div className="image-input-class">
      <Upload
        name="image"
        action="/upload/image"
        onChange={handleChange}
        maxCount={1}
        accept=".jpg,.jpeg,.png,.gif"
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
          {uploading ? "Uploading" : "Choose an Image"}
        </Button>
      </Upload>
      {uploadedImage && (
        <Space>
          <p>
            <span className="uploaded-text">Uploaded Image:</span>{" "}
            <span>{uploadedImage}</span>
          </p>
          <span onClick={handleRemove} className="close-outline-button">
            <CloseOutlined />
          </span>
        </Space>
      )}
    </div>
  );
};

export default ImageInput;
