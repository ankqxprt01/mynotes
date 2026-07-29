import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "../resources/layout.css";
import logo from '../resources/images/at.png';

function Navbar({ children }) {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);
  const { user } = useSelector((state) => state.users);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const userMenu = [
    {
      name: "Home",
      icon: "bx bx-home-alt",
      path: "/",
    },
    {
      name: "Notes",
      icon: "bx bx-edit-alt",
      path: "/users-notes",
    },
    {
      name: "Profile",
      icon: "bx bx-user-circle",
      path: "/profile",
    },
    {
      name: "Logout",
      icon: "bx bx-log-out-circle",
      path: "/logout",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "bx bx-home-alt-2",
    },
   
    {
      name: "Users",
      path: "/admin/users",
      icon: "bx bx-user",
    },

    {
      name: "Admin Notes",
      path: "/admin-notes",
      icon: "bx bx-message-square-edit",
    },

    {
      name: "Users Notes",
      path: "/admin-users-notes",
      icon: "bx bx-message-square-edit",
    },
   
    {
      name: "Logout",
      path: "/logout",
      icon: "bx bx-log-out-circle",
    },

   
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    toast.loading("Logging out...");
    try {
      // Simulate async action, replace with actual logout API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.removeItem("token");
      navigate("/login");
      toast.success("User logged out successfully");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      toast.dismiss();
      setShowNavbar(false);
      setTimeout(() => {
        toast.success("User logged out successfully");
      }, 500);
    }
  };

  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
      setShowNavbar(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <img className="logo" src={logo} alt="logo"/>
          </div>

          <div
            className={`menu-icon ${showNavbar ? "active" : ""}`}
            onClick={handleShowNavbar}
          >
            <i
              className={showNavbar ? "bx bx-x" : "bx bx-menu-alt-right"}
              style={{ fontSize: "2em", color: "#574c4c" }}
            ></i>
          </div>
          <div className={`nav-elements ${showNavbar ? "active" : ""}`}>
            <ul>
              {menuToBeRendered.map((item, index) => (
                <li
                  key={index}
                  className={item.path === currentPath ? "active" : ""}
                >
                  <i
                    className={item.icon}
                    onClick={() => handleNavigation(item.path)}
                  ></i>
                  <span onClick={() => handleNavigation(item.path)}>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="content">{children}</div>
      </nav>
    </>
  );
}

export default Navbar;
