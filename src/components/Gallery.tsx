"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = { url: string; isPrimary?: boolean };

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  if (!photos?.length) return null;

  const hero =
    photos.find((p) => p.isPrimary)?.url || photos[0]?.url || "";

  function openAt(i: number) {
    setIdx(i);
    setOpen(true);
  }

  return (
    <div>
      {/* HERO */}
      <div
        className="relative w-full h-80 md:h-[28rem] rounded overflow-hidden bg-gray-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero}
          alt=""
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => openAt(Math.max(0, photos.findIndex(p => p.url === hero)))}
        />
      </div>

      {/* THUMB GRID */}
      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.url + i}
              onClick={() => openAt(i)}
              className="relative aspect-[4/3] border rounded overflow-hidden"
              aria-label={`Open photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex flex-col"
          onClick={() => setOpen(false)}
        >
          <div className="flex-1 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[idx].url}
              alt=""
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              className="px-3 py-1.5 bg-white rounded"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              className="px-3 py-1.5 bg-white/90 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setIdx((i) => (i - 1 + photos.length) % photos.length);
              }}
            >
              ← Prev
            </button>
            <div className="text-white text-sm">
              {idx + 1} / {photos.length}
            </div>
            <button
              className="px-3 py-1.5 bg-white/90 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setIdx((i) => (i + 1) % photos.length);
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
