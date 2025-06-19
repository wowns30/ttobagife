'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function UserPage() {
  type Match = {
  id: number;
  date: string;
  opponent: string;
  score: string;
  mvp?: { name: string };
};

type PlayerStat = {
  id: number;
  name: string;
  position: string;
  count?: number; // 출석왕 API용
  attendanceCount?: number;
  mvpCount?: number;
};

  const [matches, setMatches] = useState<Match[]>([])
  const [topAttendees, setTopAttendees] = useState<PlayerStat[]>([])

  useEffect(() => {
    axios.get('http://localhost:3000/match')
      .then(res => setMatches(res.data))

    axios.get('http://localhost:3000/attendance/top5')
      .then(res => setTopAttendees(res.data))
  }, [])

  return (
    <div className="p-6 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-2">🗓 최근 경기</h2>
        <ul className="space-y-2">
          {matches.map((m) => (
            <li key={m.id} className="p-4 border rounded">
              <div>📅 {new Date(m.date).toLocaleDateString()}</div>
              <div>🆚 {m.opponent}</div>
              <div>🏁 {m.score}</div>
              <div>⭐ MVP: {m.mvp?.name || '미정'}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">📊 출석왕 TOP 5</h2>
        <ul className="list-decimal pl-6 space-y-1">
          {topAttendees.map((p, i) => (
            <li key={p.id}>
              {i + 1}. {p.name} - {p.count}회 출석
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
