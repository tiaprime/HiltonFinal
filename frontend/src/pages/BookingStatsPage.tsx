// src/components/BookingStatsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingStat } from "../types/BookingStat";

const BookingStatsPage: React.FC = () => {
  const [stats, setStats] = useState<BookingStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  //fetching booking stats from the API
  useEffect(() => {
    fetch(
      "https://hiltonfinalbackend-f9fthsb5dkh4e7gh.eastus-01.azurewebsites.net/Data/EntertainerBookingStats"
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data: BookingStat[]) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // small error handelling
  if (loading) return <p>Loading booking stats…</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Entertainer Booking Stats</h2>
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Details</th>
            <th>Stage Name</th>
            <th>Times Booked</th>
            <th>Last Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.entStageName}>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    navigate(`/entertainerInfo/${stat.entertainerID}`)
                  }
                >
                  Details
                </button>
              </td>
              <td>{stat.entStageName}</td>
              <td>{stat.bookingCount}</td>
              <td>
                {stat.lastBookingDate ? (
                  new Date(stat.lastBookingDate).toLocaleDateString()
                ) : (
                  <em>—</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button
          className="btn btn-success"
          onClick={() => navigate("/addEntertainer")}
        >
          {" "}
          Add Entertainer
        </button>
        <button className="btn btn-warning me-2" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default BookingStatsPage;
