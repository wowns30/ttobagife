'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Player = {
  id: number
  name: string
  position: string
}

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [matchForm, setMatchForm] = useState({
    date: '',
    opponent: '',
    score: '',
    mvpId: 0,
  })

  const [attendanceForm, setAttendanceForm] = useState({
    date: '',
    playerId: 0,
  })

  const [matchList, setMatchList] = useState<Match[]>([])
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([])

  useEffect(() => {
    axios.get<Match[]>('http://localhost:3000/match').then(res => setMatchList(res.data))
    axios.get<Attendance[]>('http://localhost:3000/attendance').then(res => setAttendanceList(res.data))
  }, [])

  const deleteMatch = async (id: number) => {
    await axios.delete(`http://localhost:3000/match/${id}`)
    setMatchList(matchList.filter((m) => m.id !== id))
  }

  const updateMatchScore = async (id : number) => {
    const newScore = prompt('새 점수를 입력하세요 (예: 3:1)')
    if (newScore) {
      await axios.put(`http://localhost:3000/match/${id}`, { score: newScore })
      const updated = matchList.map((m) => m.id === id ? { ...m, score: newScore } : m)
      setMatchList(updated)
    }
  }

  const deleteAttendance = async (id: number) => {
    await axios.delete(`http://localhost:3000/attendance/${id}`)
    setAttendanceList(attendanceList.filter((a) => a.id !== id))
  }

  const updateAttendanceDate = async (id : number) => {
    const newDate = prompt('새 날짜를 입력하세요 (YYYY-MM-DD)')
    if(newDate) {
      await axios.put(`http://localhost:3000/attendance/${id}`, {
        date: new Date(newDate).toISOString(),
      })
      const updated = attendanceList.map((a) => a.id === id ? {...a, date: newDate} : a)
      setAttendanceList(updated)
    }
  }

  useEffect(() => {
    axios.get<Player[]>('http://localhost:3000/player').then((res) => setPlayers(res.data))
  }, [])

  const handleMatchSubmit = async () => {
    await axios.post('http://localhost:3000/match', {
      date: new Date(matchForm.date).toISOString(),
      opponent: matchForm.opponent,
      score: matchForm.score,
      mvp: { connect: { id: matchForm.mvpId } }
    })
    alert('경기 등록 완료')
  }

  const handleAttendanceSubmit = async () => {
    await axios.post('http://localhost:3000/attendance', {
      date: new Date(attendanceForm.date).toISOString(),
      player: { connect: { id: attendanceForm.playerId } }
    })
    alert('출석 등록 완료')
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">관리자 페이지</h1>

      {/* 경기 등록 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">📅 경기 등록</h2>
        <input
          type="date"
          value={matchForm.date}
          onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          type="text"
          placeholder="상대 팀"
          value={matchForm.opponent}
          onChange={(e) => setMatchForm({ ...matchForm, opponent: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          type="text"
          placeholder="점수 (예: 2:1)"
          value={matchForm.score}
          onChange={(e) => setMatchForm({ ...matchForm, score: e.target.value })}
          className="border px-2 py-1"
        />
        <select
          value={matchForm.mvpId}
          onChange={(e) => setMatchForm({ ...matchForm, mvpId: Number(e.target.value) })}
          className="border px-2 py-1"
        >
          <option value={0}>MVP 선택</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button onClick={handleMatchSubmit} className="bg-blue-500 text-white px-4 py-1 rounded">
          등록
        </button>
      </section>

      {/* 출석 등록 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">✅ 출석 등록</h2>
        <input
          type="date"
          value={attendanceForm.date}
          onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
          className="border px-2 py-1"
        />
        <select
          value={attendanceForm.playerId}
          onChange={(e) => setAttendanceForm({ ...attendanceForm, playerId: Number(e.target.value) })}
          className="border px-2 py-1"
        >
          <option value={0}>선수 선택</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button onClick={handleAttendanceSubmit} className="bg-green-500 text-white px-4 py-1 rounded">
          출석 등록
        </button>
      </section>

      {/* 경기 목록 */}
      <section>
        <h2 className="text-xl font-semibold">📋 경기 목록</h2>
        <ul className="space-y-2">
          {matchList.map((m) => (
            <li key={m.id} className="border p-2 rounded flex justify-between items-center">
              <div>
                {new Date(m.date).toLocaleDateString()} vs {m.opponent} | {m.score}
              </div>
              <div className="space-x-2">
                <button onClick={() => updateMatchScore(m.id)} className="text-blue-600">✏️</button>
                <button onClick={() => deleteMatch(m.id)} className="text-red-600">🗑</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {/* 출석 목록 */}
      <section>
        <h2 className="text-xl font-semibold">✅ 출석 목록</h2>
        <ul className="space-y-2">
          {attendanceList.map((a) => (
            <li key={a.id} className="border p-2 rounded flex justify-between items-center">
              <div>
                {new Date(a.date).toLocaleDateString()} - 선수 ID: {a.playerId}
              </div>
              <div className="space-x-2">
                <button onClick={() => updateAttendanceDate(a.id)} className="text-blue-600">✏️</button>
                <button onClick={() => deleteAttendance(a.id)} className="text-red-600">🗑</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
