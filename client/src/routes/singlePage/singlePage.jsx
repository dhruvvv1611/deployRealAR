import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { CircleXIcon, DeleteIcon, Edit } from "lucide-react";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post?.isSaved || false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    if (!post) {
      navigate("/"); // Redirect to the homepage
    }
  }, [post, navigate]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      try {
        await apiRequest.delete(`/posts/${post.id}`);
        alert("Post deleted successfully.");
        navigate("/profile");
      } catch (err) {
        console.error("Delete failed with error:", err);
  
        // Handle specific error status codes
        if (err.response) {
          console.log("Response data:", err.response.data);
          console.log("Response status:", err.response.status);
        }
  
        // Show user-friendly error messages
        if (err.response?.status === 403) {
          alert("You are not authorized to delete this post.");
        } else if (err.response?.status === 404) {
          alert("Post not found. It may have already been deleted.");
        } else {
          alert("Failed to delete the post. Please try again.");
        }
      }
    }
  };
  

  const handleChat = async () => {
    if (!currentUser) {
      // Redirect to login if user is not logged in
      alert("Please log in to start a chat.");
      return;
    }

    try {
      const chatResponse = await apiRequest.get(`/chats?userId=${post.userId}`);

      if (chatResponse.data.length > 0) {
        // If chat exists, set the chat state to the existing chat
        setChat(chatResponse.data[0]); // Assuming setChat is the state setter for your chat
        setActiveChatId(chatResponse.data[0].id); // Set the active chat ID
      } else {
        // If no chat exists, create a new one
        const newChatResponse = await apiRequest.post("/chats", {
          receiverId: post.userId, // Ensure you're passing the correct receiver ID
        });

        // Set the newly created chat in the state
        setChat(newChatResponse.data); // Assuming newChatResponse.data contains the newly created chat
        setActiveChatId(newChatResponse.data.id); // Set the active chat ID
        navigate("/profile");
      }
    } catch (err) {
      console.error("Error handling chat:", err);
      alert("Failed to open or create a chat. Please try again.");
    }
  };

  // Navigate to 3D models page
  const handleNavigateToModels = () => {
    navigate(`/models/${post.id}`); // Adjust the path based on your routing
  };

  const handleNavigateToPanoramic = () => {
    navigate(`/panoramic/${post.id}`); // Adjust the path based on your routing
  };

  // Function to open Google Street View
  const handleOpenStreetView = () => {
    const { latitude, longitude } = post; // Ensure you have latitude and longitude in the post data
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
    window.open(streetViewUrl, "_blank"); // Open in a new tab
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1 style={{ display: "inline-block" }}>{post.title}</h1>
                <div className="buttonsGroup">
                  <button
                    className="viewModelsBtn"
                    onClick={handleNavigateToModels}
                  >
                    View 3D Models
                  </button>
                  <button
                    className="viewPanoramicBtn"
                    onClick={handleNavigateToPanoramic}
                  >
                    View 3D Images
                  </button>
                  <button
                    className="openStreetViewBtn"
                    onClick={handleOpenStreetView}
                  >
                    Open Google Street View
                  </button>
                </div>

                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">₹ {post.price}</div>
              </div>
              <div className="user">
                <span>Listed By</span>
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
                <span>{post.user.phone}</span>
              </div>
            </div>
            <div className="bottom-flex">
              <div
                className="bottom"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.postDetail.desc),
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttonsGroup">
            {currentUser?.id !== post.userId ? (
              <>
                <button onClick={handleChat} className="sendMessage">
                  <img src="/chat.png" alt="Chat Icon" />
                  Send a Message
                </button>

                <button
                  onClick={handleSave}
                  className={`saveButton ${saved ? "saved" : ""}`}
                >
                  <img src="/save.png" alt="Save Icon" />
                  {saved ? "Place Saved" : "Save the Place"}
                </button>
              </>
            ) : (
              <>
                <Link to={`/update/${post.id}`}>
                  <button className="updateButton">
                    <Edit />
                    Update Post
                  </button>
                </Link>
                <button onClick={handleDelete} className="deleteButton">
                  <CircleXIcon />
                  Delete Post
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
