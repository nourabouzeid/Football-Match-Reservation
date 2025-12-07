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
  const [ticketId, setTicketId] = useState(null); // store the ticketId

  const handleReserve = async () => {
    if (!cardNumber || !pin) {
      alert("Please enter card number and pin");
      return;
    }

    setLoading(true);
    try {
      const res = await reserveSeatAPI(seatId, token);
      // Extract ticketId from the response
      const ticket = res.data?.message?.ticketId;
      setTicketId(ticket);
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

      {!ticketId && (
        <>
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
        </>
      )}

      {ticketId && (
        <div className="ticket-info">
          <h3>Reservation Successful!</h3>
          <p>Your Ticket ID: <strong>{ticketId}</strong></p>
          <button onClick={() => navigate("/")}>Go Back Home</button>
        </div>
      )}
    </div>
  );
}
