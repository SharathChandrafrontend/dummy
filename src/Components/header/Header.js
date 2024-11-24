import "./header.css";
import dishLogo from "../../assets/dish_wordmark.jpg";
import userIcon from "../../assets/user_icon.jpg";
// Header
function Header() {
  return (
    <div className="header-container">
      <div className="heading-container">
        <img src={dishLogo} alt="dish_logo" className="dish-logo" />
        <h1 className="header-title">Custom Tagging Interface </h1>
      </div>
      <img className="header-user-icon" src={userIcon} alt="user_icon" />
    </div>
  );
}

export default Header;
