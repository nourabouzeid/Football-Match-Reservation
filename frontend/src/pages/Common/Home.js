import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { viewMatchesAPI } from "../../api/matchAPI";
import "./Home.css";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleViewMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await viewMatchesAPI();
      setMatches(res.data);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Football Match Reservation System</h1>
      <p>Please signup or login to continue.</p>

      <button className="home-button" onClick={handleViewMatches}>
        View Matches
      </button>

      {loading && <p>Loading matches...</p>}
      {error && <p className="home-error">{error}</p>}

      {matches.length > 0 && (
        <table className="matches-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Main Referee</th>
              <th>Linesmen</th>
              <th>View Seats</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.id}</td>
                <td>{match.Hometeam}</td>
                <td>{match.Awayteam}</td>
                <td>{match.Matchvenue || "TBD"}</td>
                <td>{new Date(match.Date).toLocaleString()}</td>
                <td>{match.Mainref}</td>
                <td>{match.Lineref1}, {match.Lineref2}</td>
                <td>
                  <button
                    onClick={() => navigate(`/match/${match.id}`)}
                  >
                    View Seats
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
