// src/pages/UpdatePostPage.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./updatePost.scss"; // Use the same styling for consistency
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function updatePostPage() {
  const { id } = useParams(); // Get the post ID from URL parameters
  const navigate = useNavigate();
  
  // State to hold post data
  const [postData, setPostData] = useState(null);
  const [value, setValue] = useState(""); // For the description
  const [images, setImages] = useState([]); // State for regular images
  const [models, setModels] = useState([]); // State for .glb models
  const [panoramicImages, setPanoramicImages] = useState([]); // State for panoramic images
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiRequest.get(`/posts/${id}`);
        setPostData(response.data); // Set the fetched post data
        setValue(response.data.postDetail.desc); // Set initial description value
        setImages(response.data.images || []); // Set initial images if available
        setModels(response.data.models || []); // Set initial models if available
        setPanoramicImages(response.data.panoramic || []); // Set initial panoramic images if available
      } catch (error) {
        console.log("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await apiRequest.put(`/posts/${id}`, {
        postData: {
          title: postData.title,
          price: postData.price,
          address: postData.address,
          city: postData.city,
          bedroom: postData.bedroom,
          bathroom: postData.bathroom,
          type: postData.type,
          property: postData.property,
          latitude: postData.latitude,
          longitude: postData.longitude,
          images: images, // Include uploaded images
          models: models, // Include uploaded models
          panoramic: panoramicImages, // Include uploaded panoramic images
        },
        postDetail: {
          desc: value,
          utilities: postData.postDetail.utilities,
          pet: postData.postDetail.pet,
          income: postData.postDetail.income,
          size: postData.postDetail.size,
          school: postData.postDetail.school,
          bus: postData.postDetail.bus,
          restaurant: postData.postDetail.restaurant,
        },
      });

      navigate("/"); // Redirect after successful update
    } catch (error) {
      console.log("Error updating post:", error);
      setError("An error occurred while updating the post.");
    }
  };

  if (!postData) {
    return <div>Loading...</div>; // Show loading state while fetching post data
  }

  return (
    <div className="newPostPage"> {/* Use the same class name for consistency */}
      <div className="formContainer">
        <h1>Update Post</h1>
        <div className="wrapper">
          <form onSubmit={handleUpdate}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={postData.price}
                onChange={(e) => setPostData({ ...postData, price: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={postData.address}
                onChange={(e) => setPostData({ ...postData, address: e.target.value })}
                required
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={postData.city}
                onChange={(e) => setPostData({ ...postData, city: e.target.value })}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                value={postData.bedroom}
                onChange={(e) => setPostData({ ...postData, bedroom: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                value={postData.bathroom}
                onChange={(e) => setPostData({ ...postData, bathroom: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                value={postData.latitude}
                onChange={(e) => setPostData({ ...postData, latitude: e.target.value })}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                value={postData.longitude}
                onChange={(e) => setPostData({ ...postData, longitude: e.target.value })}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                value={postData.type}
                onChange={(e) => setPostData({ ...postData, type: e.target.value })}
                required
              >
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select
                name="property"
                value={postData.property}
                onChange={(e) => setPostData({ ...postData, property: e.target.value })}
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <button className="sendButton" type="submit">Update</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>

      <div className="sideContainer">
        {/* Upload Button for Regular Images */}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dsfhv73xf",
            uploadPreset: "estate",
            folder: "posts",
            resourceType: "image", // Specify for images
          }}
          setState={setImages} // Update images state
          buttonLabel="Upload Images" // Label for image upload button
        />

        {/* Upload Button for Models */}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dsfhv73xf",
            uploadPreset: "estate",
            folder: "posts",
            resourceType: "raw", // Specify for .glb files
          }}
          setState={setModels} // Update models state
          buttonLabel="Upload Models (.glb)" // Label for model upload button
        />

        {/* Upload Button for Panoramic Images */}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dsfhv73xf",
            uploadPreset: "estate",
            folder: "panoramic", // Folder for panoramic images
            resourceType: "image", // Specify for panoramic images
          }}
          setState={setPanoramicImages} // Update panoramic images state
          buttonLabel="Upload Panoramic Images" // Label for panoramic image upload button
        />
      </div>
    </div>
  );
}

export default updatePostPage;
