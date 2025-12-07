import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { viewSeatsAPI } from "../../api/matchAPI";
import "./MatchDetails.css";

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await viewSeatsAPI(id);

        setMatch(res.data.match);
        setSeats(res.data.seats);
      } catch (err) {
        console.error("Failed to fetch match details:", err);
        setError("Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!match) return <p className="error">No match found</p>;

  // Compute seat grid
  const maxRow = Math.max(...seats.map(s => s.r), 0);
  const maxCol = Math.max(...seats.map(s => s.col), 0);

  const grid = Array.from({ length: maxRow }, (_, r) =>
    Array.from({ length: maxCol }, (_, c) =>
      seats.find(s => s.r === r + 1 && s.col === c + 1)
    )
  );

  return (
    <div className="match-details-container">
      <h2 className="title">Match Details</h2>

      <div className="match-info">
        <p><strong>Home Team:</strong> {match.Hometeam}</p>
        <p><strong>Away Team:</strong> {match.Awayteam}</p>
        <p><strong>Venue:</strong> {match.Matchvenue}</p>
        <p><strong>Date:</strong> {new Date(match.Date).toLocaleString()}</p>
        <p><strong>Main Referee:</strong> {match.Mainref}</p>
        <p><strong>Assistant Referees:</strong> {match.Lineref1}, {match.Lineref2}</p>
      </div>

      <h3 className="seat-title">Seat Map</h3>

      <div className="seat-grid">
        {grid.map((row, rIdx) => (
          <div className="seat-row" key={rIdx}>
            {row.map((seat, cIdx) => (
              <div
                key={cIdx}
                className={`seat ${seat?.reserved ? "reserved" : "vacant"}`}
              >
                {seat?.id || "-"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
