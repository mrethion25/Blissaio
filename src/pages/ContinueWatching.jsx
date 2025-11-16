import React from "react";
import { useUser } from "@clerk/clerk-react";
import { loadData } from "../lib/tracker";
import { Link } from "react-router-dom";

export default function ContinueWatching(){
  const { user } = useUser();
  const userId = user?.id || "guest";
  const data = loadData(userId);

  const now = Date.now();

  const list = data.entries
    .filter(e => e.lastWatched && (now - new Date(e.lastWatched).getTime()) < 7*24*60*60*1000)
    .sort((a,b)=> new Date(b.lastWatched) - new Date(a.lastWatched));

  if(list.length===0) return <></>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Continue Watching</h3>

      <ul>
        {list.map(e=>(
          <li key={e.id} className="flex justify-between py-2 border-b">
            <div>
              <Link to={`/anime/${e.id}`}>{e.title}</Link>
              <div className="text-sm text-gray-400">
                Last watched: {e.lastWatched.slice(0,10)}
              </div>
            </div>

            <div>{e.progress || 0}%</div>
          </li>
        ))}
      </ul>
    </div>
  );
      }
