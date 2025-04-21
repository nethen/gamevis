"use client";
import { X_DIMENSIONS, Y_DIMENSIONS } from "@/app/utils/types/types";
import { useState } from "react";
import { motion } from "motion/react";
export const SpatialNav = () => {
  const [active, setActive] = useState(false);
  return (
    <aside className="fixed bottom-6 left-6 bg-neutral-800 rounded-md p-4 shadow-md shadow-cyan-500 z-10">
      <section className="grid grid-cols-3 grid-rows-3 gap-4 mb-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <button
            key={index}
            className="flex items-center justify-center p-4 bg-neutral-600 rounded-md"
          >
            1000
          </button>
        ))}
      </section>
      <section className="flex justify-between">
        <p>Group by region</p>
        <div
          className={`flex p-1 w-12 bg-neutral-600 rounded-full cursor-pointer`}
          onClick={() => setActive(!active)}
        >
          <motion.div
            className={`size-4 rounded-full ${
              active ? "bg-green-500" : "bg-neutral-800"
            }`}
          />
        </div>
      </section>
    </aside>
  );
};
