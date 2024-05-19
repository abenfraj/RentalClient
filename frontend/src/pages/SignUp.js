import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ onSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added confirm password state
  const [type, setType] = useState("tenant");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const result = await onSignUp(name, email, password, type);
    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div>
            <label>Confirm Password:</label>{" "}
            {/* Added confirm password field */}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
