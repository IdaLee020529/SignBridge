import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface DownloadButtonProps {
  type: string;
  downloadVideo: (name: string) => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  type,
  downloadVideo,
}) => {
  return (
    <Button onClick={() => downloadVideo(type)}>
      <span>
        <DownloadOutlined />
      </span>
      <span style={{ marginLeft: "8px" }}>Download</span>
    </Button>
  );
};

export default DownloadButton;
