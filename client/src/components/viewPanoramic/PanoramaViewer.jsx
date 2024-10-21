import React from "react";
import "./panoramaViewer.scss";

const PanoramaViewer = ({ panoramicUrl }) => {
  return (
    <div className="panoramaViewer">
      <a-scene embedded>
        <a-sky src={panoramicUrl} rotation="0 0 0"></a-sky>
        <a-entity position="0 1.6 0">
          <a-camera></a-camera>
        </a-entity>
        <a-xr-button></a-xr-button> {/* Include XR button if necessary */}
      </a-scene>
    </div>
  );
};

export default PanoramaViewer;
