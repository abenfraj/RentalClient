import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyRentals.css";

const MyRentals = ({ user }) => {
  const [rentals, setRentals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRental, setNewRental] = useState({
    itemId: "",
    startDate: "",
    endDate: "",
    type: "",
    location: "",
    price: "",
  });

  useEffect(() => {
    if (user) {
      const fetchRentals = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/api/rentals`,
            {
              params: {
                userId: user._id,
              },
            }
          );
          setRentals(response.data);
        } catch (error) {
          console.error("Error fetching rentals:", error);
        }
      };
      fetchRentals();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setNewRental({ ...newRental, [e.target.name]: e.target.value });
  };

  const handleAddRental = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/rentals", {
        ...newRental,
        userId: user._id,
      });
      setRentals([...rentals, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding rental:", error);
    }
  };

  return (
    <div className="my-rentals">
      <h2>My Rentals</h2>
      {user.type === "owner" && (
        <button
          className="add-rental-btn"
          onClick={() => setShowForm(!showForm)}
        >
          Add Rental
        </button>
      )}
      {showForm && (
        <form className="rental-form" onSubmit={handleAddRental}>
          <input
            name="itemId"
            placeholder="Item ID"
            value={newRental.itemId}
            onChange={handleInputChange}
          />
          <input
            name="startDate"
            placeholder="Start Date"
            type="date"
            value={newRental.startDate}
            onChange={handleInputChange}
          />
          <input
            name="endDate"
            placeholder="End Date"
            type="date"
            value={newRental.endDate}
            onChange={handleInputChange}
          />
          <input
            name="type"
            placeholder="Type"
            value={newRental.type}
            onChange={handleInputChange}
          />
          <input
            name="location"
            placeholder="Location"
            value={newRental.location}
            onChange={handleInputChange}
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={newRental.price}
            onChange={handleInputChange}
          />
          <button type="submit">Add Rental</button>
        </form>
      )}
      <ul>
        {rentals.map((rental) => (
          <li key={rental._id}>
            <p>Type: {rental.type}</p>
            <p>Location: {rental.location}</p>
            <p>Price: {rental.price}</p>
            <p>Start Date: {rental.startDate}</p>
            <p>End Date: {rental.endDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRentals;
