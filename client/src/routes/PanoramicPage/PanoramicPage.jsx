import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import PanoramaViewer from "../../components/viewPanoramic/PanoramaViewer";
import "./panoramicPage.scss";

const PanoramicPage = () => {
  const { id } = useParams();
  const [panoramics, setPanoramics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPanoramics = async () => {
      try {
        const response = await apiRequest.get(`/panoramic/${id}/images`);
        setPanoramics(response.data.panoramics);
      } catch (error) {
        console.error("Error fetching panoramics:", error);
        setError("Failed to load panoramic images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPanoramics();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner as mentioned
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="panoramicPage">
      <h1>360° Panoramic Images</h1>
      <div className="panoramicContainer">
        {panoramics.length === 0 ? (
          <p>No panoramic images available for this house.</p>
        ) : (
          panoramics.map((panoramic, index) => (
            <div key={index} className="panoramicWrapper">
              <PanoramaViewer panoramicUrl={panoramic} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PanoramicPage;
