import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { loadData, updateEntry } from "../lib/tracker";

export default function AnimeDetail({ id }) {
  const { user } = useUser();
  const userId = user?.id || "guest";

  const [entry, setEntry] = useState(null);

  useEffect(()=>{
    const s = loadData(userId);
    setEntry(s.entries.find(x=>String(x.id)===String(id)));
  },[id,userId]);

  if(!entry) return <div>Anime not found.</div>;

  const updateProgress = v => {
    updateEntry(userId, entry.id, {
      progress: v,
      lastWatched: new Date().toISOString()
    });
    setEntry(prev=>({...prev, progress: v, lastWatched: new Date().toISOString()}));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">{entry.title}</h2>

      <div className="mb-4">
        <label>Progress: {entry.progress || 0}%</label>
        <input type="range" min="0" max="100" value={entry.progress||0}
          onChange={e=>updateProgress(Number(e.target.value))}/>
      </div>

      <div>
        <p className="text-gray-300">Added: {entry.date}</p>
        <p className="text-gray-300">Type: {entry.type}</p>
      </div>
    </div>
  );
      }
