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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Failed to load matches");
    }
  };

  const fetchStadiums = async () => {
    try {
      const res = await getAllStadiumsAPI();
      setStadiums(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stadiums");
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
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
      const response = await createMatchAPI(matchData);
      if (response.data && response.data.message === "Match created successfully") {
        fetchMatches();
        setShowCreateMatch(false);
        e.target.reset();
        alert("Match created successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to create match");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error creating match";
      setError(errorMsg);
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.target);
    const matchData = {
      Hometeam: formData.get("Hometeam") || undefined,
      Awayteam: formData.get("Awayteam") || undefined,
      Date: formData.get("Date") || undefined,
      Mainref: formData.get("Mainref") || undefined,
      Lineref1: formData.get("Lineref1") || undefined,
      Lineref2: formData.get("Lineref2") || undefined,
      StadiumId: formData.get("stadiumId") ? parseInt(formData.get("stadiumId")) : undefined,
      // Get stadium name for Matchvenue if stadium is selected
      Matchvenue: formData.get("stadiumId") ? 
        stadiums.find(s => s.id === parseInt(formData.get("stadiumId")))?.name : undefined
    };
    
    try {
      const response = await updateMatchAPI(editingMatch.id, matchData);
      if (response.data && response.data.message === "Match updated successfully") {
        fetchMatches();
        setEditingMatch(null);
        alert("Match updated successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to update match");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error updating match";
      setError(errorMsg);
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStadium = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.target);
    const stadiumData = {
      name: formData.get("name"),
      width: parseInt(formData.get("width")),
      length: parseInt(formData.get("length")),
    };
    
    try {
      const response = await createStadiumAPI(stadiumData);
      if (response.data && response.data.message === "User authorized successfully") {
        fetchStadiums();
        setShowCreateStadium(false);
        e.target.reset();
        alert("Stadium created successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to create stadium");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error creating stadium";
      setError(errorMsg);
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSeats = async (match) => {
    try {
      const res = await getMatchSeatsAPI(match.id);
      if (res.data && res.data.seats) {
        setSeats(res.data.seats);
        setSelectedMatch(match.id);
        
        // Find stadium dimensions for this match
        const stadium = stadiums.find(s => s.id === match.StadiumId);
        if (stadium) {
          setStadiumDimensions({
            width: stadium.width,
            length: stadium.length
          });
        } else {
          // Calculate from seats data if stadium not found
          const maxCol = Math.max(...res.data.seats.map(s => s.col));
          const maxRow = Math.max(...res.data.seats.map(s => s.r));
          setStadiumDimensions({
            width: maxCol,
            length: maxRow
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load seat data");
    }
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
  };

  // Function to organize seats into rows
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

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="manager-container">
      <h2>EFA Manager Dashboard</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="action-buttons">
        <button onClick={() => setShowCreateMatch(true)} disabled={loading}>
          Create New Match
        </button>
        <button onClick={() => setShowCreateStadium(true)} disabled={loading}>
          Add New Stadium
        </button>
      </div>

      {/* Create Match Form */}
      {showCreateMatch && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Match</h3>
            <form onSubmit={handleCreateMatch}>
              <input name="Hometeam" placeholder="Home Team" required disabled={loading} />
              <input name="Awayteam" placeholder="Away Team" required disabled={loading} />
              <input name="Date" type="datetime-local" required disabled={loading} />
              <input name="Mainref" placeholder="Main Referee" required disabled={loading} />
              <input name="Lineref1" placeholder="Linesman 1" required disabled={loading} />
              <input name="Lineref2" placeholder="Linesman 2" required disabled={loading} />
              <select name="stadiumId" required disabled={loading}>
                <option value="">Select Stadium</option>
                {stadiums.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.width}x{s.length})
                  </option>
                ))}
              </select>
              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Match"}
                </button>
                <button type="button" onClick={() => setShowCreateMatch(false)} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Form */}
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
                disabled={loading}
              />
              <input 
                name="Awayteam" 
                placeholder="Away Team" 
                defaultValue={editingMatch.Awayteam}
                required 
                disabled={loading}
              />
              <input 
                name="Date" 
                type="datetime-local" 
                defaultValue={formatDateForInput(editingMatch.Date)}
                required 
                disabled={loading}
              />
              <input 
                name="Mainref" 
                placeholder="Main Referee" 
                defaultValue={editingMatch.Mainref}
                required 
                disabled={loading}
              />
              <input 
                name="Lineref1" 
                placeholder="Linesman 1" 
                defaultValue={editingMatch.Lineref1}
                required 
                disabled={loading}
              />
              <input 
                name="Lineref2" 
                placeholder="Linesman 2" 
                defaultValue={editingMatch.Lineref2}
                required 
                disabled={loading}
              />
              <select name="stadiumId" required disabled={loading}>
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
                <button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Match"}
                </button>
                <button type="button" onClick={handleCancelEdit} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Stadium Form */}
      {showCreateStadium && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Stadium</h3>
            <form onSubmit={handleCreateStadium}>
              <input name="name" placeholder="Stadium Name" required disabled={loading} />
              <input name="width" type="number" placeholder="Width (seats per row)" min="1" required disabled={loading} />
              <input name="length" type="number" placeholder="Length (rows)" min="1" required disabled={loading} />
              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Stadium"}
                </button>
                <button type="button" onClick={() => setShowCreateStadium(false)} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="card">
        <h3>All Matches ({matches.length})</h3>
        <table className="manager-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Home</th>
              <th>Away</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Referee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No matches found. Create your first match!
                </td>
              </tr>
            ) : (
              matches.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.Hometeam}</td>
                  <td>{m.Awayteam}</td>
                  <td>{m.Matchvenue}</td>
                  <td>{m.Date ? new Date(m.Date).toLocaleString() : "N/A"}</td>
                  <td>{m.Mainref}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditMatch(m)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewSeats(m)}
                      disabled={loading}
                    >
                      View Seats
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Seat View - Now in rectangular layout */}
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
          
          {/* Stadium Layout - Rectangular Grid */}
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
              
              {/* Rows with seat data */}
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
          
          {/* Legend */}
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
          
          <button className="close-btn" onClick={() => setSelectedMatch(null)} disabled={loading}>
            Close Seat View
          </button>
        </div>
      )}
    </div>
  );
}