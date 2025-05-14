import Link from "next/link"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-center py-6 md:py-8 text-center">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Wakayama University Student. All rights reserved.
          </p>
        </div>
        <div className="flex items-center mt-4">
          <Link
            href="mailto:student@wakayama-u.ac.jp"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            student@wakayama-u.ac.jp
          </Link>
        </div>
      </div>
    </footer>
  )
}
