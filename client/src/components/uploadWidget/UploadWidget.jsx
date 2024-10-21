import { createContext, useEffect, useState } from "react";

const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setState, buttonLabel = "Upload" }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const uwScript = document.getElementById("uw");

    if (!uwScript) {
      const script = document.createElement("script");
      script.setAttribute("async", "");
      script.setAttribute("id", "uw");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }

    return () => {
      if (uwScript) {
        uwScript.removeEventListener("load", () => setLoaded(true));
      }
    };
  }, []);

  useEffect(() => {
    if (loaded && window.cloudinary && window.cloudinary.createUploadWidget) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the uploaded info: ", result.info);
            // Update state by appending the new URL to the existing state array
            setState((prevState) => [...prevState, result.info.secure_url]); 
          }
        }
      );

      const buttonId = buttonLabel.replace(" ", "_");
      const buttonElement = document.getElementById(buttonId);
      
      if (buttonElement) {
        const openWidget = () => myWidget.open();
        buttonElement.addEventListener("click", openWidget);

        return () => {
          buttonElement.removeEventListener("click", openWidget);
        };
      }
    }
  }, [loaded, uwConfig, setState, buttonLabel]);

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id={buttonLabel.replace(" ", "_")}
        className="cloudinary-button"
        disabled={!loaded || !window.cloudinary}
      >
        {buttonLabel} {/* Always show the button label */}
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };