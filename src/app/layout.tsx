import "./globals.css";
import Link from "next/link";
import "@uploadthing/react/styles.css";

export const metadata = { title: "SGS Locations", description: "Dallas Ft. Worth’s largest location database" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">SGS Locations</Link>
            <nav className="flex gap-6">
              <Link href="/search">Search Locations</Link>
              <Link href="/library">Location Library</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/list-your-property">List Your Property</Link>
            </nav>
            <div className="flex gap-2">
              <Link className="px-3 py-1 rounded border" href="/login">Login</Link>
              <Link className="px-3 py-1 rounded bg-black text-white" href="/register">Sign Up</Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t">
  <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-6 text-sm">
    <div>
      <div className="font-semibold mb-2">SGS Locations</div>
      <p>Dallas Ft. Worth’s largest location database.</p>
      <div className="flex gap-3 mt-3">
        <a href="#" aria-label="Instagram" className="underline">IG</a>
        <a href="#" aria-label="Facebook" className="underline">FB</a>
        <a href="#" aria-label="LinkedIn" className="underline">LI</a>
      </div>
    </div>
    <div>
      <div className="font-semibold mb-2">Quick Links</div>
      <div className="grid gap-1">
        <Link href="/search">Search</Link>
        <Link href="/library">Library</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </div>
    <div>
      <div className="font-semibold mb-2">For Owners</div>
      <Link href="/list-your-property">List Your Property</Link>
    </div>
    <div>
      <div className="font-semibold mb-2">Contact</div>
      <div>Fort Worth, TX</div>
      <a href="tel:15555555555">(555) 555-5555</a><br/>
      <a href="mailto:info@sgslocations.com">info@sgslocations.com</a>
    </div>
  </div>
  <div className="text-xs text-center py-3 border-t">
    © {new Date().getFullYear()} SGS Locations • <Link href="/privacy">Privacy</Link> • <Link href="/terms">Terms</Link>
  </div>
</footer>
      </body>
    </html>
  );
}
