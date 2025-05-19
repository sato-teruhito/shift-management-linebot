import { CalendarClock } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full border-b bg-sky-300 py-4 px-6 shadow-sm">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <CalendarClock className="h-6 w-6 text-white" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white">
          まぐろや　シフト提出システム
        </h1>
      </div>
    </header>
  )
}
