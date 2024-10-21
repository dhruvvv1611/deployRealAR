import React from "react";
import "./modelViewer.scss";

const ModelViewer = ({ modelUrl }) => {
  return (
    <div>
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="scene-viewer webxr quick-look"
        camera-controls
        tone-mapping="neutral"
        poster="poster.webp"
        shadow-intensity="1.09"
        exposure="1"
        shadow-softness="0.65"
        style={{ width: "100%", height: "500px" }}
      >
        <button slot="ar-button" id="ar-button">
          View in your space
        </button>
      </model-viewer>
    </div>
  );
};

export default ModelViewer;
