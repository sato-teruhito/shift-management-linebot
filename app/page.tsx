"use client";

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { supabase } from '@/lib/supabase';

type User = { id: string; name: string };
type ShiftChoice = '〇' | '×' | '';

export default function ShiftForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [shifts, setShifts] = useState<ShiftChoice[]>(Array(7).fill(''));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();

    const today = dayjs();
    const nextMonday = today.day() === 0 ? today.add(1, 'day') : today.day(8);
    const dates = Array.from({ length: 7 }, (_, i) =>
      nextMonday.add(i, 'day').format('MM/DD')
    );
    setWeekDates(dates);
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('ユーザー取得失敗:', error.message);
    } else {
      setUsers(data);
    }
  };

  const handleSelect = (index: number, choice: ShiftChoice) => {
    setShifts((prev) => {
      const updated = [...prev];
      updated[index] = prev[index] === choice ? '' : choice;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      alert('名前を選択してください');
      return;
    }

    setLoading(true);

    const today = dayjs();
    const nextMonday = today.day() === 0 ? today.add(1, 'day') : today.day(8);
    const weekStart = nextMonday.format('YYYY-MM-DD');

    const shiftData = {
      user_id: selectedUserId,
      week_start: weekStart,
      mon: shifts[0],
      tue: shifts[1],
      wed: shifts[2],
      thu: shifts[3],
      fri: shifts[4],
      sat: shifts[5],
      sun: shifts[6],
    };

    const { error } = await supabase.from('shifts').insert([shiftData]);

    setLoading(false);

    if (error) {
      console.error('送信失敗:', error.message);
      alert('シフトの送信に失敗しました');
    } else {
      alert('シフトを送信しました');
      setShifts(Array(7).fill(''));
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 text-center">
      <h1 className="text-xl font-bold mb-4">シフト提出フォーム</h1>

      {/* 名前選択 */}
      <div className="mb-6">
        <label className="block text-sm mb-2">名前を選択してください</label>
        <select
          className="border p-2 rounded w-48"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- 選択 --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* シフト入力表 */}
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full border">
          <thead>
            <tr>
              {['月', '火', '水', '木', '金', '土', '日'].map((day, i) => (
                <th key={i} className="border px-4 py-2 text-sm">
                  {day}
                  <br />
                  {weekDates[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {shifts.map((choice, i) => (
                <td key={i} className="border p-2">
                  <button
                    className={`px-2 py-1 w-10 rounded ${
                      choice === '〇' ? 'bg-green-300' : 'bg-gray-100'
                    }`}
                    onClick={() => handleSelect(i, '〇')}
                  >
                    〇
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              {shifts.map((choice, i) => (
                <td key={i} className="border p-2">
                  <button
                    className={`px-2 py-1 w-10 rounded ${
                      choice === '×' ? 'bg-red-300' : 'bg-gray-100'
                    }`}
                    onClick={() => handleSelect(i, '×')}
                  >
                    ×
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 送信ボタン */}
      <div className="mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
}
