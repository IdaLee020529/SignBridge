import './SlrPreviewVideo.css';
import React, { useEffect, useState } from 'react';

interface SlrPreviewVideoProps {
    videoFile: File;
}

const SlrPreviewVideo: React.FC<SlrPreviewVideoProps> = ({ videoFile }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (videoFile) {
            const url = URL.createObjectURL(videoFile);
            setVideoUrl(url);

            // Clean up the URL when component unmounts or when videoFile changes
            return () => URL.revokeObjectURL(url);
        }
    }, [videoFile]);

    return (
        <div className="slr-preview-video-menu">
            {videoUrl &&
                (
                    <video controls className="slr-preview-video">
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                )}
        </div>
    );
};

export default SlrPreviewVideo;
