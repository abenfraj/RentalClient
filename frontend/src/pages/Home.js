import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./Home.css";

const Home = () => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rentals");
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  return (
    <div>
      <h2>All Rentals</h2>
      <div className="cards-container">
        {rentals.map((rental) => (
          <div className="card" key={rental._id}>
            <p>
              <strong>Type:</strong> {rental.type}
            </p>
            <p>
              <strong>Location:</strong> {rental.location}
            </p>
            <p>
              <strong>Price:</strong> {rental.price}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {rental.startDate
                ? format(new Date(rental.startDate), "PPP")
                : "N/A"}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {rental.endDate ? format(new Date(rental.endDate), "PPP") : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
