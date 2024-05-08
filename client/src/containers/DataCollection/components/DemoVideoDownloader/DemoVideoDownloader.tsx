import React from "react";
import { getDemoVidById } from "../../../../services/dataset.service";

interface Props {
  videoLink: string;
  videoName: string;
}

const DemoVideoDownloader: React.FC<Props> = ({ videoLink, videoName }) => {
  const handleDownload = () => {
    getDemoVidById(form_id);
  };

  return (
    <div>
      <span className="video-details-info">
        <button onClick={handleDownload}>{videoName}</button>
      </span>
    </div>
  );
};

export default DemoVideoDownloader;
