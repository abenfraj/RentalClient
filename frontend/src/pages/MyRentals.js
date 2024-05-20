import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./MyRentals.css";

const MyRentals = ({ user }) => {
  const [rentals, setRentals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRental, setNewRental] = useState({
    startDate: "",
    endDate: "",
    type: "",
    location: "",
    price: "",
  });

  const rentalTypes = ["Apartment", "House", "Studio", "Loft"];

  useEffect(() => {
    if (user) {
      const fetchRentals = async () => {
        try {
          const endpoint =
            user.type === "tenant"
              ? `http://localhost:3001/api/rentals?tenantId=${user._id}`
              : `http://localhost:3001/api/rentals?ownerId=${user._id}`;
          const response = await axios.get(endpoint);
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

  const isFormValid = () => {
    const { startDate, endDate, type, location, price } = newRental;
    return startDate && endDate && type && location && price;
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

  if (!user) {
    return <div>Loading...</div>; // or handle the error as you need
  }

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
          <select
            name="type"
            value={newRental.type}
            onChange={handleInputChange}
          >
            <option value="">Select Type</option>
            {rentalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
          <button type="submit" disabled={!isFormValid()}>
            Add Rental
          </button>
        </form>
      )}
      <div className="cards-container">
        {rentals.map((rental) => (
          <div
            className={`card ${rental.tenantId ? "rented" : ""}`}
            key={rental._id}
          >
            <p>
              <strong>Type:</strong> {rental.type}
            </p>
            <p>
              <strong>Location:</strong> {rental.location}
            </p>
            <p>
              <strong>Price:</strong> ${rental.price}
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
            {rental.tenantId && <p className="rented-label">Already rented</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;
