import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p className="des">
          Our AR-driven real estate platform transforms property exploration with immersive 3D tours and interactive features. Seamlessly visualize spaces, customize interiors, and access local insights—all in one dynamic, intuitive experience that redefines how you discover and engage with real estate!
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1><a target="_blank" href="https://youtu.be/Tn7f-QMs8OQ?si=i5MqcaLDEbG8e1Nt">16+</a></h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
