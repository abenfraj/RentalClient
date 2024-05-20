import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./Home.css";

const Home = () => {
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [userType] = useState("tenant"); // Simule le type d'utilisateur
  const [filters, setFilters] = useState({
    availability: "",
    type: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rentals");
        setRentals(response.data);
        setFilteredRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = rentals;

      if (filters.availability) {
        filtered = filtered.filter((rental) =>
          filters.availability === "available"
            ? !rental.tenantId
            : rental.tenantId
        );
      }

      if (filters.type) {
        filtered = filtered.filter((rental) => rental.type === filters.type);
      }

      if (filters.location) {
        filtered = filtered.filter((rental) =>
          rental.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.minPrice) {
        filtered = filtered.filter(
          (rental) => rental.price >= parseInt(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        filtered = filtered.filter(
          (rental) => rental.price <= parseInt(filters.maxPrice)
        );
      }

      setFilteredRentals(filtered);
    };

    applyFilters();
  }, [filters, rentals]);

  const handleRent = async (rental) => {
    try {
      const tenantId = "user123"; // Simule l'ID du tenant
      const response = await axios.put(
        `http://localhost:3001/api/rentals/${rental._id}`,
        {
          userId: rental.userId,
          startDate: rental.startDate,
          endDate: rental.endDate,
          tenantId,
        }
      );
      setRentals(
        rentals.map((r) => (r._id === rental._id ? response.data : r))
      );
    } catch (error) {
      console.error("Error updating rental:", error);
    }
  };

  return (
    <div className="home">
      <h1>Home</h1>
      <div className="filter-bar">
        <select
          name="availability"
          value={filters.availability}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
        </select>
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Studio">Studio</option>
          <option value="Loft">Loft</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
      </div>
      <div className="cards-container">
        {filteredRentals.map((rental) => (
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
            {rental.tenantId ? (
              <p className="rented-label">Already rented</p>
            ) : (
              userType === "tenant" && (
                <button onClick={() => handleRent(rental)}>
                  Rent this apartment
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
