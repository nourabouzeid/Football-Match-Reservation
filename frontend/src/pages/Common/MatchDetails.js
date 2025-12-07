import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { viewSeatsAPI, unReserveSeatAPI } from "../../api/matchAPI";
import { useSelector } from "react-redux";

import "./MatchDetails.css";

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token  = useSelector((state) => state.auth.token);

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
  const maxRow = Math.max(...seats.map((s) => s.r), 0);
  const maxCol = Math.max(...seats.map((s) => s.col), 0);
  const grid = Array.from({ length: maxRow }, (_, r) =>
    Array.from({ length: maxCol }, (_, c) =>
      seats.find((s) => s.r === r + 1 && s.col === c + 1)
    )
  );

  // Check if the match is more than 3 days away
  const daysFromMatch = () => {
    const matchDate = new Date(match.Date);
    const now = new Date();
    const diffTime = matchDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays;
  };

  const handleSeatClick = async (seat) => {
    if (!seat) return;

    if (!seat.reserved) {
      // vacant seat → navigate to payment page
      navigate("/payment", { state: { matchId: id, seatId: seat.id } });
    } else {
      // reserved seat → attempt to unreserve
      const days = daysFromMatch();
      if (days < 0) {
        alert("Old match");
        return;
      }
      if (days < 3) {
        alert("Too late, match is less than 3 days away");
        return;
      }


      const confirmUnreserve = window.confirm(
        `Do you want to unreserve seat ${seat.id}?`
      );
      if (!confirmUnreserve) return;

      try {
        await unReserveSeatAPI(seat.id, token);
        // update seat locally
        setSeats((prevSeats) =>
          prevSeats.map((s) =>
            s.id === seat.id ? { ...s, reserved: 0 } : s
          )
        );
        alert(`Seat ${seat.id} has been unreserved`);
      } catch (err) {
        console.error(err);
        alert("Failed to unreserve seat");
      }
    }
  };

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
                onClick={() => handleSeatClick(seat)}
                style={{ cursor: seat?.reserved ? "pointer" : "pointer" }}
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
