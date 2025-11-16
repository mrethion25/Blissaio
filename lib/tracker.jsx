const STORAGE_KEY = "blinime_user_data_v2";

export function userKey(userId){
  return `${STORAGE_KEY}_${userId || 'guest'}`;
}

export function loadData(userId){
  try{
    const raw = localStorage.getItem(userKey(userId));
    return raw ? JSON.parse(raw) : { entries: [] };
  } catch {
    return { entries: [] };
  }
}

export function saveData(userId, data){
  localStorage.setItem(userKey(userId), JSON.stringify(data));
}

export function addEntry(userId, entry){
  const s = loadData(userId);
  s.entries.unshift(entry);
  saveData(userId, s);
}

export function updateEntry(userId, id, patch){
  const s = loadData(userId);
  s.entries = s.entries.map(e => e.id===id? {...e,...patch}: e);
  saveData(userId, s);
}

export function removeEntry(userId,id){
  const s = loadData(userId);
  s.entries = s.entries.filter(e=>e.id!==id);
  saveData(userId,s);
}

export function exportCSV(userId){
  const s = loadData(userId);
  const rows = [["id","title","date","type","progress","lastWatched","notes"]];
  s.entries.forEach(e=>{
    rows.push([
      e.id,
      e.title,
      e.date,
      e.type,
      e.progress || 0,
      e.lastWatched || "",
      (e.notes || "").replace(/\n/g," ")
    ]);
  });

  return rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
}

export function importCSV(userId, csv){
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if(lines.length < 2) return;

  const entries = lines.slice(1).map(line=>{
    const cols = line.match(/("([^"]|"")*"|[^,]+)/g)
      .map(c=>c.replace(/^"|"$/g,"").replace(/""/g,'"'));

    return {
      id: cols[0],
      title: cols[1],
      date: cols[2],
      type: cols[3],
      progress: Number(cols[4]),
      lastWatched: cols[5],
      notes: cols[6]
    };
  });

  const s = loadData(userId);
  s.entries = [...entries, ...s.entries];
  saveData(userId, s);
                       }
