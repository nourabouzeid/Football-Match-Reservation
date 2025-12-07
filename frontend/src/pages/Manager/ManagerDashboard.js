// pages/Manager/ManagerDashboard.js
import React, { useEffect, useState } from "react";
import {
  getAllMatchesAPI,
  createMatchAPI,
  updateMatchAPI,
  createStadiumAPI,
  getAllStadiumsAPI,
  getMatchSeatsAPI,
} from "../../api/managerAPI";
import "./ManagerDashboard.css";

export default function ManagerDashboard() {
  const [matches, setMatches] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [seats, setSeats] = useState([]);
  const [stadiumDimensions, setStadiumDimensions] = useState({ width: 0, length: 0 });
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [showCreateStadium, setShowCreateStadium] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    fetchMatches();
    fetchStadiums();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await getAllMatchesAPI();
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStadiums = async () => {
    try {
      const res = await getAllStadiumsAPI();
      setStadiums(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const matchData = {
      Hometeam: formData.get("Hometeam"),
      Awayteam: formData.get("Awayteam"),
      Date: formData.get("Date"),
      Mainref: formData.get("Mainref"),
      Lineref1: formData.get("Lineref1"),
      Lineref2: formData.get("Lineref2"),
      stadiumId: parseInt(formData.get("stadiumId")),
    };
    try {
      await createMatchAPI(matchData);
      fetchMatches();
      setShowCreateMatch(false);
      e.target.reset();
    } catch (err) {
      alert("Error creating match: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const matchData = {
      Hometeam: formData.get("Hometeam"),
      Awayteam: formData.get("Awayteam"),
      Date: formData.get("Date"),
      Mainref: formData.get("Mainref"),
      Lineref1: formData.get("Lineref1"),
      Lineref2: formData.get("Lineref2"),
      StadiumId: parseInt(formData.get("stadiumId")),
    };
    
    try {
      await updateMatchAPI(editingMatch.id, matchData);
      fetchMatches();
      setEditingMatch(null);
      alert("Match updated successfully!");
    } catch (err) {
      alert("Error updating match: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateStadium = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const stadiumData = {
      name: formData.get("name"),
      width: parseInt(formData.get("width")),
      length: parseInt(formData.get("length")),
    };
    try {
      await createStadiumAPI(stadiumData);
      fetchStadiums();
      setShowCreateStadium(false);
      e.target.reset();
    } catch (err) {
      alert("Error creating stadium: " + (err.response?.data?.message || err.message));
    }
  };

  const handleViewSeats = async (match) => {
    try {
      const res = await getMatchSeatsAPI(match.id);
      setSeats(res.data);
      setSelectedMatch(match.id);
            const stadium = stadiums.find(s => s.id === match.StadiumId);
      if (stadium) {
        setStadiumDimensions({
          width: stadium.width,
          length: stadium.length
        });
      } else {
        const maxCol = Math.max(...res.data.map(s => s.col));
        const maxRow = Math.max(...res.data.map(s => s.r));
        setStadiumDimensions({
          width: maxCol,
          length: maxRow
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
  };

  const organizeSeatsByRows = () => {
    const organizedSeats = [];
    
    for (let row = 1; row <= stadiumDimensions.length; row++) {
      const rowSeats = [];
      for (let col = 1; col <= stadiumDimensions.width; col++) {
        const seat = seats.find(s => s.r === row && s.col === col);
        rowSeats.push(seat || { r: row, col: col, reserved: false, id: null });
      }
      organizedSeats.push(rowSeats);
    }
    
    return organizedSeats;
  };

  const organizedSeats = organizeSeatsByRows();

  return (
    <div className="manager-container">
      <h2>EFA Manager Dashboard</h2>

      <div className="action-buttons">
        <button onClick={() => setShowCreateMatch(true)}>Create New Match</button>
        <button onClick={() => setShowCreateStadium(true)}>Add New Stadium</button>
      </div>

      {showCreateMatch && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Match</h3>
            <form onSubmit={handleCreateMatch}>
              <input name="Hometeam" placeholder="Home Team" required />
              <input name="Awayteam" placeholder="Away Team" required />
              <input name="Date" type="datetime-local" required />
              <input name="Mainref" placeholder="Main Referee" required />
              <input name="Lineref1" placeholder="Linesman 1" required />
              <input name="Lineref2" placeholder="Linesman 2" required />
              <select name="stadiumId" required>
                <option value="">Select Stadium</option>
                {stadiums.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.width}x{s.length})</option>
                ))}
              </select>
              <div className="form-buttons">
                <button type="submit">Create Match</button>
                <button type="button" onClick={() => setShowCreateMatch(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingMatch && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Match #{editingMatch.id}</h3>
            <form onSubmit={handleUpdateMatch}>
              <input 
                name="Hometeam" 
                placeholder="Home Team" 
                defaultValue={editingMatch.Hometeam}
                required 
              />
              <input 
                name="Awayteam" 
                placeholder="Away Team" 
                defaultValue={editingMatch.Awayteam}
                required 
              />
              <input 
                name="Date" 
                type="datetime-local" 
                defaultValue={editingMatch.Date ? new Date(editingMatch.Date).toISOString().slice(0, 16) : ""}
                required 
              />
              <input 
                name="Mainref" 
                placeholder="Main Referee" 
                defaultValue={editingMatch.Mainref}
                required 
              />
              <input 
                name="Lineref1" 
                placeholder="Linesman 1" 
                defaultValue={editingMatch.Lineref1}
                required 
              />
              <input 
                name="Lineref2" 
                placeholder="Linesman 2" 
                defaultValue={editingMatch.Lineref2}
                required 
              />
              <select name="stadiumId" required>
                <option value="">Select Stadium</option>
                {stadiums.map(s => (
                  <option 
                    key={s.id} 
                    value={s.id}
                    selected={s.id === editingMatch.StadiumId}
                  >
                    {s.name} ({s.width}x{s.length})
                  </option>
                ))}
              </select>
              <div className="form-buttons">
                <button type="submit">Update Match</button>
                <button type="button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateStadium && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Stadium</h3>
            <form onSubmit={handleCreateStadium}>
              <input name="name" placeholder="Stadium Name" required />
              <input name="width" type="number" placeholder="Width (seats per row)" min="1" required />
              <input name="length" type="number" placeholder="Length (rows)" min="1" required />
              <div className="form-buttons">
                <button type="submit">Add Stadium</button>
                <button type="button" onClick={() => setShowCreateStadium(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h3>All Matches</h3>
        <table className="manager-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Home</th>
              <th>Away</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Stadium Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => {
              const stadium = stadiums.find(s => s.id === m.StadiumId);
              return (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.Hometeam}</td>
                  <td>{m.Awayteam}</td>
                  <td>{m.Matchvenue}</td>
                  <td>{m.Date ? new Date(m.Date).toLocaleString() : "N/A"}</td>
                  <td>{stadium ? `${stadium.width}×${stadium.length}` : "N/A"}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditMatch(m)}
                    >
                      Edit
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewSeats(m)}
                    >
                      View Seats
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedMatch && stadiumDimensions.width > 0 && (
        <div className="card">
          <h3>Seat Status for Match {selectedMatch}</h3>
          <p className="stadium-info">
            Stadium Layout: {stadiumDimensions.width} seats per row × {stadiumDimensions.length} rows
            <br />
            Total Seats: {stadiumDimensions.width * stadiumDimensions.length}
            <br />
            Reserved Seats: {seats.filter(s => s.reserved).length} | 
            Vacant Seats: {seats.filter(s => !s.reserved).length}
          </p>
          
          {/*rec */}
          <div className="stadium-layout">
            <div className="stadium-grid">
              {/* Column Headers */}
              <div className="column-headers">
                <div className="empty-corner"></div>
                {Array.from({ length: stadiumDimensions.width }, (_, i) => (
                  <div key={`col-header-${i+1}`} className="column-header">
                    Col {i + 1}
                  </div>
                ))}
              </div>
              
              {organizedSeats.map((rowSeats, rowIndex) => (
                <div key={`row-${rowIndex}`} className="stadium-row">
                  <div className="row-header">Row {rowIndex + 1}</div>
                  {rowSeats.map((seat, colIndex) => (
                    <div
                      key={`seat-${rowIndex}-${colIndex}`}
                      className={`seat ${seat.reserved ? "reserved" : "vacant"} ${seat.id ? "" : "no-seat"}`}
                      title={`Row ${seat.r}, Col ${seat.col} - ${seat.reserved ? "Reserved" : "Vacant"}`}
                    >
                      {seat.id ? `${seat.r},${seat.col}` : "X"}
                      {seat.reserved && <div className="reserved-indicator"></div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-box vacant"></div>
              <span>Vacant Seat</span>
            </div>
            <div className="legend-item">
              <div className="legend-box reserved"></div>
              <span>Reserved Seat</span>
            </div>
            <div className="legend-item">
              <div className="legend-box no-seat"></div>
              <span>No Seat (Invalid)</span>
            </div>
          </div>
          
          <button className="close-btn" onClick={() => setSelectedMatch(null)}>Close Seat View</button>
        </div>
      )}
    </div>
  );
}