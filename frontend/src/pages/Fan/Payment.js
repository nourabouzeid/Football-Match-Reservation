import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { reserveSeatAPI } from "../../api/matchAPI";
import { useSelector } from "react-redux";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  const { matchId, seatId } = location.state;

  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    if (!cardNumber || !pin) {
      alert("Please enter card number and pin");
      return;
    }

    setLoading(true);
    try {
      await reserveSeatAPI(seatId, token);
      alert(`Seat ${seatId} reserved successfully!`);
      navigate("/"); // go back home
    } catch (err) {
      console.error(err);
      alert("Failed to reserve seat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment for Seat</h2>
      <p>Match ID: {matchId}</p>
      <p>Seat ID: {seatId}</p>

      <input
        type="text"
        placeholder="Credit Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <input
        type="password"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <button onClick={handleReserve} disabled={loading}>
        {loading ? "Processing..." : "Reserve Seat"}
      </button>
    </div>
  );
}
