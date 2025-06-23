"use client";

import { LoadingAnimation } from "@/components/shared/loading-animaion";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-white">
      <div className="relative w-60 h-60 sm:w-72 sm:h-72">
        <div
          className="absolute inset-0 rounded-full border-[12px] border-t-blue-500 border-r-violet-500 border-b-green-500 border-l-purple-400 animate-spin
        bg-white/5 backdrop-blur-sm shadow-md shadow-black/10"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <LoadingAnimation />
          <p className="text-sm mt-2 text-gray-400">Dashboard Loading...</p>
          <p className="text-xs mt-1 text-gray-300 italic">
            Eat <span className="not-italic text-white">Code</span> And Sleep
          </p>
        </div>
      </div>
    </div>
  );
}
