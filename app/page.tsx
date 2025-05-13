"use client";

import dayjs from "dayjs";
import { useState, useEffect } from "react";

const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];

type ShiftChoice = '〇' | '×' | '';

export default function ShiftForm() {
  const [names, setNames] = useState(['田中', '佐藤', '鈴木']);
  const [selectedName, setSelectedName] = useState('');
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [shifts, setShifts] = useState<ShiftChoice[]>(Array(7).fill(''));

  useEffect(() => {
    const today = dayjs();
    const nextMonday = today.day() === 0 ? today.add(1, 'day') : today.day(8);
    const dates = Array.from({ length: 7 }, (_, i) =>
      nextMonday.add(i, 'day').format('MM/DD')
    );
    setWeekDates(dates);
  }, []);

  const handleSelect = (index: number, choice: ShiftChoice) => {
    setShifts(prev => {
      const updated = [...prev];
      updated[index] = prev[index] === choice ? '' : choice;
      return updated;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-xl font-bold mb-4">シフト提出フォーム</h1>

      {/* 名前選択 */}
      <div className="mb-6">
        <label className="block text-sm mb-2">名前を選択してください</label>
        <select
          className="border p-2 rounded w-48"
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        >
          <option value="">-- 選択 --</option>
          {names.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* シフト入力表 */}
      <table className="table-auto mx-auto border">
        <thead>
          <tr>
            {daysOfWeek.map((day, i) => (
              <th key={i} className="border px-4 py-2">
                {day}<br />{weekDates[i]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {shifts.map((choice, i) => (
              <td key={i} className="border p-2">
                <button
                  className={`px-2 py-1 w-10 rounded ${choice === '〇' ? 'bg-green-300' : 'bg-gray-100'}`}
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
                  className={`px-2 py-1 w-10 rounded ${choice === '×' ? 'bg-red-300' : 'bg-gray-100'}`}
                  onClick={() => handleSelect(i, '×')}
                >
                  ×
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* 送信ボタン（未実装） */}
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" disabled>
          送信（未実装）
        </button>
      </div>

    </div>
  );
}
