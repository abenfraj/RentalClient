import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ onSignIn }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSignIn(identifier, password);
    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email or Username:</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
