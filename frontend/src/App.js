// src/App.js

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

function App() {
  const [tab, setTab] = useState("reports");
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ category: "", value: "" });

  const API_URL = process.env.REACT_APP_API_URL; // Use environment variable here
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Fix: wrap fetchData in useCallback so useEffect dependency is satisfied
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Now ESLint is happy

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.category || form.value === "") {
      alert("Category and value are required!");
      return;
    }
    try {
      const res = await axios.post(API_URL, {
        category: form.category,
        value: Number(form.value),
      });
      setData([...data, res.data]);
      setForm({ category: "", value: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to delete all data?")) return;
    try {
      await Promise.all(data.map((item) => axios.delete(`${API_URL}/${item._id}`)));
      setData([]);
    } catch (err) {
      console.error(err);
    }
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "20px",
    margin: "10px",
    minWidth: "250px",
    flex: 1,
    textAlign: "center"
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f4f6f8", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <button onClick={() => setTab("reports")} style={{ margin: "0 10px", padding: "10px 20px", background: tab === "reports" ? "#0088FE" : "#ccc", color: "#fff", border: "none", borderRadius: "5px" }}>Reports</button>
        <button onClick={() => setTab("settings")} style={{ margin: "0 10px", padding: "10px 20px", background: tab === "settings" ? "#00C49F" : "#ccc", color: "#fff", border: "none", borderRadius: "5px" }}>Settings</button>
      </div>

      {tab === "reports" && (
        <div>
          {/* Top Stats */}
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
            <div style={cardStyle}>
              <h3>Total Categories</h3>
              <p style={{ fontSize: "28px", fontWeight: "bold", color: "#0088FE" }}>{data.length}</p>
            </div>
            <div style={cardStyle}>
              <h3>Total Value</h3>
              <p style={{ fontSize: "28px", fontWeight: "bold", color: "#00C49F" }}>{totalValue}</p>
            </div>
          </div>

          {/* Charts */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", marginTop: "40px" }}>
            <div style={cardStyle}>
              <h3>Bar Chart</h3>
              <BarChart width={400} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>

            <div style={cardStyle}>
              <h3>Line Chart</h3>
              <LineChart width={400} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </div>

            <div style={cardStyle}>
              <h3>Pie Chart</h3>
              <PieChart width={400} height={300}>
                <Pie data={data} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ marginTop: "50px" }}>
            <h3>Raw Data Table</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden" }}>
              <thead style={{ background: "#f0f0f0" }}>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "12px" }}>Category</th>
                  <th style={{ border: "1px solid #ddd", padding: "12px" }}>Value</th>
                  <th style={{ border: "1px solid #ddd", padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{item.category}</td>
                    <td style={{ padding: "12px" }}>{item.value}</td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => handleDelete(item._id)} style={{ padding: "5px 10px", background: "red", color: "#fff", border: "none", borderRadius: "5px" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", maxWidth: "400px", margin: "auto" }}>
            <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ margin: "5px 0", padding: "10px" }} />
            <input type="number" placeholder="Value" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} style={{ margin: "5px 0", padding: "10px" }} />
            <button type="submit" style={{ marginTop: "10px", padding: "10px", background: "#0088FE", color: "#fff", border: "none", borderRadius: "5px" }}>Add Data</button>
          </form>
          <button onClick={handleReset} style={{ marginTop: "10px", padding: "10px", background: "red", color: "white", border: "none", borderRadius: "5px", display: "block", marginLeft: "auto", marginRight: "auto" }}>
            Reset All Data
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
