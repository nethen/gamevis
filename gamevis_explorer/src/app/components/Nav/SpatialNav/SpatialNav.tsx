"use client";
import { Annotation, XY_KEYS } from "@/app/utils/types/types";
import { Dispatch, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFilterContext } from "../FilterNav/FilterNav";

export const SpatialNav = ({
  data,
  value,
  handler,
  options,
}: {
  data: Annotation[][];
  value: string;
  handler: Dispatch<React.SetStateAction<string>>;
  options: string[];
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const active = value == options[1];

  const { filters, setFilters } = useFilterContext();

  useEffect(() => {
    console.log(XY_KEYS);
    console.log(filters.position);
  }, [filters]);

  return (
    <motion.aside className="bg-neutral-800 rounded-xl p-4 z-10 w-full sticky bottom-4">
      <AnimatePresence>
        {!active && isOpen && (
          <motion.section
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 mb-2">
              {data.map((item, index) => (
                <motion.button
                  key={index}
                  className={`flex items-center justify-center p-4 rounded-md ${
                    filters.position.some(
                      (item) =>
                        item.y == XY_KEYS.y[Math.floor(index / 3)] &&
                        item.x == XY_KEYS.x[index % 3]
                    )
                      ? "bg-green-500"
                      : "bg-neutral-700"
                  } ${
                    item.length > 0
                      ? "opacity-100 cursor-pointer"
                      : "opacity-10 cursor-not-allowed"
                  } transition-colors`}
                  onClick={() => {
                    if (item.length <= 0) return;
                    setFilters({
                      ...filters,
                      position: filters.position.some(
                        (item) =>
                          item.y == XY_KEYS.y[Math.floor(index / 3)] &&
                          item.x == XY_KEYS.x[index % 3]
                      )
                        ? filters.position.filter(
                            (item) =>
                              item.y != XY_KEYS.y[Math.floor(index / 3)] ||
                              item.x != XY_KEYS.x[index % 3]
                          )
                        : [
                            ...filters.position,
                            {
                              y: XY_KEYS.y[Math.floor(index / 3)],
                              x: XY_KEYS.x[index % 3],
                            },
                          ],
                    });
                  }}
                >
                  {item.length}
                </motion.button>
              ))}
            </div>
            <div className="mb-4 flex justify-center">
              <motion.button
                className={`text-sm tracking-wide font-bold text-foreground/80 ${
                  filters.position.length == 0
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                animate={{
                  opacity: filters.position.length == 0 ? 0.5 : 1,
                }}
                onClick={() =>
                  setFilters({
                    ...filters,
                    position: [],
                  })
                }
              >
                Select all
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <section className="flex justify-between flex-wrap">
        <p
          className={`flex gap-2 select-none ${
            !active ? "cursor-pointer" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          Group by all
          <AnimatePresence>
            {!active && (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                initial={{ rotate: isOpen ? 180 : 0, opacity: 0 }}
                animate={{ rotate: isOpen ? 180 : 0, opacity: 1 }}
                exit={{ rotate: isOpen ? 180 : 0, opacity: 0 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </p>
        <motion.div
          className={`flex p-1 w-12 bg-neutral-600 rounded-full cursor-pointer ${
            !active ? "justify-end " : "justify-start"
          }`}
          onClick={() => {
            handler(active ? options[0] : options[1]);
            setFilters({
              ...filters,
              position: [],
            });
            setIsOpen(true);
          }}
          layout
        >
          <motion.div
            className={`size-4 rounded-full transition-colors ${
              !active ? "bg-green-500" : "bg-neutral-800"
            }`}
            layout
            key="toggle-thumb"
          />
        </motion.div>
      </section>
    </motion.aside>
  );
};
