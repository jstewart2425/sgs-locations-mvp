import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search — SGS Locations",
  description: "Filter and browse filming locations across DFW.",
};

// Force this route to be dynamic (avoids static/rendering pitfalls)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8">Loading…</div>}>
      <SearchClient />
    </Suspense>
  );
}
