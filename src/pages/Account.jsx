import React from "react";
import { useUser } from "@clerk/clerk-react";
import { loadData, removeEntry, updateEntry } from "../lib/tracker";
import { Link } from "react-router-dom";

export default function Watchlist(){
  const { user } = useUser();
  const userId = user?.id || "guest";
  const entries = loadData(userId).entries;
  
  const list = entries.filter(e => e.type === "watchlist");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Watchlist</h2>

      {list.length===0 && <p>No items in watchlist</p>}

      <ul>
        {list.map(item=>(
          <li key={item.id} className="flex justify-between py-2 border-b">
            <div>
              <Link to={`/anime/${item.id}`} className="font-medium">{item.title}</Link>
            </div>

            <div className="flex gap-2">
              <button className="px-2 py-1 bg-green-600"
                onClick={()=>updateEntry(userId,item.id,{type:"watching",lastWatched:new Date().toISOString()})}>
                Start
              </button>

              <button className="px-2 py-1 bg-red-600"
                onClick={()=>removeEntry(userId, item.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
                  }
