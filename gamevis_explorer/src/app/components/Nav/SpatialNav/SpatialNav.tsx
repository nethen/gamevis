"use client";
import { X_DIMENSIONS, Y_DIMENSIONS } from "@/app/utils/types/types";
import { Dispatch, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
export const SpatialNav = ({
  value,
  handler,
  options,
}: {
  value: string;
  handler: Dispatch<React.SetStateAction<string>>;
  options: string[];
}) => {
  const active = value == options[1];
  return (
    <motion.aside className="fixed bottom-6 left-6 bg-neutral-800 rounded-xl p-4 z-10 w-60">
      <AnimatePresence>
        {active && (
          <motion.section
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 mb-2">
              {Array.from({ length: 9 }).map((_, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center p-4 bg-neutral-600 rounded-md cursor-pointer"
                >
                  1000
                </button>
              ))}
            </div>
            <div className="mb-4 flex justify-center">
              <button className="cursor-pointer text-sm tracking-wide font-bold text-foreground/80">
                Select all
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <section className="flex justify-between">
        <p>Group by region</p>
        <motion.div
          className={`flex p-1 w-12 bg-neutral-600 rounded-full cursor-pointer ${
            active ? "justify-end" : "justify-start"
          }`}
          onClick={() => handler(active ? options[0] : options[1])}
          layout
        >
          <motion.div
            className={`size-4 rounded-full transition-colors ${
              active ? "bg-green-500" : "bg-neutral-800"
            }`}
            layout
            key="toggle-thumb"
          />
        </motion.div>
      </section>
    </motion.aside>
  );
};
