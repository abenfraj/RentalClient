import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyRentals from "./pages/MyRentals";
import { setToken, getToken, removeToken } from "./utils/auth";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      axios
        .get("http://localhost:3002/api/me", {
          headers: { "x-access-token": token },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          removeToken();
        });
    }
  }, []);

  const handleSignIn = async (identifier, password) => {
    try {
      const response = await axios.post("http://localhost:3002/api/signin", {
        identifier,
        password,
      });
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error("Sign-in error:", error);
      return false;
    }
  };

  const handleSignUp = async (name, email, password, type) => {
    try {
      const response = await axios.post("http://localhost:3002/api/signup", {
        name,
        email,
        password,
        type,
      });
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error("Sign-up error:", error);
      return false;
    }
  };

  return (
    <Router>
      <div>
        <header>
          <h1>Rental Service</h1>
          <nav>
            <Link to="/">Home</Link>
            {user && <Link to="/my-rentals">My Rentals</Link>}
            {user ? (
              <UserMenu
                user={user}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                setUser={setUser}
              />
            ) : (
              <>
                <Link to="/sign-in">Sign In</Link>
                <Link to="/sign-up">Sign Up</Link>
              </>
            )}
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home user={user} token={getToken()} />} />
          <Route path="/sign-in" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/sign-up" element={<SignUp onSignUp={handleSignUp} />} />
          <Route
            path="/my-rentals"
            element={<MyRentals user={user} token={getToken()} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

const UserMenu = ({ user, dropdownOpen, setDropdownOpen, setUser }) => {
  const navigate = useNavigate();

  const handleDisconnect = () => {
    setUser(null);
    removeToken();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="user-menu">
      <span onClick={() => setDropdownOpen(!dropdownOpen)}>
        Welcome, {user.name} ({user.type})
      </span>
      {dropdownOpen && (
        <div className="dropdown-menu">
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default App;
