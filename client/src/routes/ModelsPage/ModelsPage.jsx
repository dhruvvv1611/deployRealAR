import "./modelPage.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import ModelViewer from "../../components/viewModel/ModelViewer";


const ModelsPage = () => {
  const { id } = useParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await apiRequest.get(`/models/${id}/models`);
        setModels(response.data.models);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="modelsPage">
        <h1>3D Models for the House</h1>
        <div className="modelsContainer">
          {models.length === 0 ? (
            <p>No models available for this house.</p>
          ) : (
            models.map((model, index) => (
              <div key={index} className="modelWrapper">
                {/* 3D Model Viewer */}
                <ModelViewer modelUrl={model} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ModelsPage;
