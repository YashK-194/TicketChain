import React from 'react';
import videoSrc from '../assets/video.mp4';
import './BackgroundVideo.css';  // Ensure CSS is in the same folder as JS file

const BackgroundVideo = () => {
  return (
    <div className="video-container">
      <video autoPlay muted loop className="background-video">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>
    </div>
  );
};

export default BackgroundVideo;
