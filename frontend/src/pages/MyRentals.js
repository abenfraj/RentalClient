import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import "./MyRentals.css";

const MyRentals = ({ user, token }) => {
  const [rentals, setRentals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRental, setNewRental] = useState({
    startDate: "",
    endDate: "",
    type: "",
    location: "",
    price: "",
  });
  const [deleteRentalId, setDeleteRentalId] = useState(null);
  const [loading, setLoading] = useState(true);

  const rentalTypes = ["Apartment", "House", "Studio", "Loft"];

  useEffect(() => {
    if (user) {
      const fetchRentals = async () => {
        try {
          const endpoint =
            user.type === "tenant"
              ? `http://localhost:3001/api/rentals?tenantId=${user._id}`
              : `http://localhost:3001/api/rentals?userId=${user._id}`;
          const response = await axios.get(endpoint, {
            headers: { "x-access-token": token },
          });
          setRentals(response.data);
        } catch (error) {
          console.error("Error fetching rentals:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRentals();
    }
  }, [user, token]);

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
      const response = await axios.post(
        "http://localhost:3001/api/rentals",
        {
          ...newRental,
          userId: user._id,
        },
        {
          headers: { "x-access-token": token },
        }
      );
      setRentals([...rentals, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding rental:", error);
    }
  };

  const handleDeleteRental = async (rentalId) => {
    try {
      await axios.delete(`http://localhost:3001/api/rentals/${rentalId}`, {
        headers: { "x-access-token": token },
      });
      setRentals(rentals.filter((rental) => rental._id !== rentalId));
      setDeleteRentalId(null);
    } catch (error) {
      console.error("Error deleting rental:", error);
    }
  };

  const handleAcceptRental = async (rentalId) => {
    try {
      await axios.put(
        `http://localhost:3001/api/rentals/accept/${rentalId}`,
        {},
        { headers: { "x-access-token": token } }
      );
      setRentals(
        rentals.map((rental) =>
          rental._id === rentalId ? { ...rental, process: "Rented" } : rental
        )
      );
    } catch (error) {
      console.error("Error accepting rental:", error);
    }
  };

  const handleRejectRental = async (rentalId) => {
    try {
      await axios.put(
        `http://localhost:3001/api/rentals/reject/${rentalId}`,
        {},
        { headers: { "x-access-token": token } }
      );
      setRentals(
        rentals.map((rental) =>
          rental._id === rentalId
            ? { ...rental, tenantId: null, process: null }
            : rental
        )
      );
    } catch (error) {
      console.error("Error rejecting rental:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
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
            className={`card ${
              rental.tenantId
                ? rental.process === "Requested"
                  ? "requested"
                  : "rented"
                : ""
            }`}
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
            {rental.tenantId && rental.process === "Requested" && (
              <>
                {user.type === "owner" && (
                  <>
                    <button onClick={() => handleAcceptRental(rental._id)}>
                      Accept
                    </button>
                    <button onClick={() => handleRejectRental(rental._id)}>
                      Reject
                    </button>
                  </>
                )}
                <p className="requested-label">Requested</p>
              </>
            )}
            {rental.tenantId && rental.process === "Rented" && (
              <p className="rented-label">Already rented</p>
            )}
            {!rental.tenantId && user.type === "owner" && (
              <button
                className="delete-rental-btn"
                onClick={() => setDeleteRentalId(rental._id)}
              >
                Delete Rental
              </button>
            )}
          </div>
        ))}
      </div>
      {deleteRentalId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDeleteRental(deleteRentalId)}
          onCancel={() => setDeleteRentalId(null)}
        />
      )}
    </div>
  );
};

export default MyRentals;
