import React, { useEffect, useState } from "react";
import AnalyticsChart from "../components/AnalyticsChart";
import ContinueWatching from "../components/ContinueWatching";
import { useUser } from "@clerk/clerk-react";

import {
  loadData,
  saveData,
  exportCSV,
  importCSV,
} from "../lib/tracker";

export default function Account() {
  const { user } = useUser();
  const userId = user?.id || "guest";

  const [data, setData] = useState({ entries: [] });

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("watched");
  const [notes, setNotes] = useState("");

  const [importMessage, setImportMessage] = useState("");

  // Load user data on mount
  useEffect(() => {
    setData(loadData(userId));
  }, [userId]);

  // Save data when data changes
  useEffect(() => {
    saveData(userId, data);
  }, [data, userId]);

  // Add entry
  const handleAdd = (e) => {
    e.preventDefault();

    const entry = {
      id: Date.now().toString(),
      title,
      date: date || new Date().toISOString().slice(0, 10),
      type,
      notes,
      progress: 0,
      lastWatched: "",
    };

    setData((prev) => ({
      entries: [entry, ...prev.entries],
    }));

    setTitle("");
    setDate("");
    setNotes("");
  };

  // Export CSV
  const handleExport = () => {
    const csv = exportCSV(userId);
    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "blinime_export.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  // Import CSV
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    importCSV(userId, text);

    setData(loadData(userId));
    setImportMessage("Imported successfully!");
  };

  // Analytics Chart Data
  const chartData = (() => {
    const counts = {};
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      counts[key] = 0;
    }

    data.entries.forEach((e) => {
      const key = (e.lastWatched || e.date || "").slice(0, 10);
      if (counts[key] !== undefined) counts[key]++;
    });

    return Object.keys(counts).map((k) => ({
      date: k,
      count: counts[k],
    }));
  })();

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Account Manager</h2>

      {/* User info */}
      <div className="bg-gray-800 p-4 rounded mb-4">
        <p>
          <strong>User:</strong>{" "}
          {user?.fullName || user?.username || user?.emailAddresses?.[0]?.emailAddress}
        </p>
        <p><strong>Total Tracked:</strong> {data.entries.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Add item form */}
        <form onSubmit={handleAdd} className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Add Anime / List Entry</h3>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Anime title"
            className="w-full p-2 mb-2 rounded bg-gray-700"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-gray-700"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-gray-700"
          >
            <option value="watched">Watched</option>
            <option value="watchlist">Watchlist</option>
            <option value="favorite">Favorite</option>
          </select>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 mb-2 rounded bg-gray-700"
            placeholder="Notes (optional)"
          />

          <button className="bg-green-600 px-3 py-1 rounded">
            Add Entry
          </button>
        </form>

        {/* Analytics */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Analytics (Last 14 Days)</h3>

          <AnalyticsChart data={chartData} />

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-blue-600 rounded"
            >
              Export CSV
            </button>

            <label className="px-3 py-1 bg-gray-700 rounded cursor-pointer">
              Import CSV
              <input
                type="file"
                className="hidden"
                onChange={handleImport}
                accept=".csv"
              />
            </label>

            <button
              onClick={() => alert("MAL Sync requires backend. I can add it whenever you want!")}
              className="px-3 py-1 bg-yellow-600 rounded"
            >
              MAL Sync (Soon)
            </button>
          </div>

          {importMessage && (
            <p className="text-green-400 text-sm mt-2">{importMessage}</p>
          )}
        </div>
      </div>

      {/* Continue Watching */}
      <ContinueWatching />

      {/* Full list */}
      <div className="bg-gray-800 p-4 rounded mt-6">
        <h3 className="font-semibold mb-2">All Entries</h3>

        {data.entries.length === 0 && (
          <p className="text-sm text-gray-400">No items yet.</p>
        )}

        <ul>
          {data.entries.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-3 border-b border-gray-700"
            >
              <div>
                <div className="font-medium">
                  {item.title}{" "}
                  <span className="text-xs text-gray-400">({item.type})</span>
                </div>
                <div className="text-sm text-gray-400">
                  {item.date} — Progress: {item.progress || 0}%
                </div>
              </div>

              <div className="flex gap-2">

                <a
                  href={`/anime/${item.id}`}
                  className="px-2 py-1 bg-indigo-600 rounded text-sm"
                >
                  Open
                </a>

                <button
                  onClick={() => {
                    const updated = data.entries.filter((e) => e.id !== item.id);
                    setData({ entries: updated });
                  }}
                  className="px-2 py-1 bg-red-600 rounded text-sm"
                >
                  Delete
                </button>

              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
  }
