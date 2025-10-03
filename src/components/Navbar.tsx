"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const ADMIN_EMAIL =
  (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "").toLowerCase();

export default function Navbar() {
  const { data: session } = useSession();
  const userEmail = (session?.user?.email || "").toLowerCase();
  const isAdmin = ADMIN_EMAIL && userEmail === ADMIN_EMAIL;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight">
            SGS Locations
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
            <Link href="/search" className="hover:text-black">Search</Link>
            <Link href="/library" className="hover:text-black">Library</Link>
            <Link href="/list-your-property" className="hover:text-black">List Your Property</Link>
            <Link href="/about" className="hover:text-black">About</Link>
            {isAdmin && <Link href="/admin/submissions" className="hover:text-black">Admin</Link>}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!session?.user ? (
            <>
              <Link href="/login" className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                Log in
              </Link>
              <Link href="/register" className="px-3 py-1.5 text-sm bg-black text-white rounded">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:block text-sm text-gray-600 mr-2">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t">
        <div className="mx-auto max-w-6xl px-4 py-2 flex gap-4 text-sm text-gray-700">
          <Link href="/search" className="hover:text-black">Search</Link>
          <Link href="/library" className="hover:text-black">Library</Link>
          <Link href="/list-your-property" className="hover:text-black">List</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          {isAdmin && <Link href="/admin/submissions" className="hover:text-black">Admin</Link>}
        </div>
      </div>
    </header>
  );
}
