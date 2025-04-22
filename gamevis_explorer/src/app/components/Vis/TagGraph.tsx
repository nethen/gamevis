import { Annotation } from "@/app/utils/types/types";
import React from "react";
import { useFilterContext } from "../Nav/FilterNav/FilterNav";

export const TagGraph = ({
  data,
  dimensions,
  baseline,
  handler,
}: {
  data: [string, number][];
  dimensions?: { x: string; y: string };
  baseline: number;
  handler: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { filters, setFilters } = useFilterContext();
  return (
    <div className="">
      {/* <h4 className="font-bold">Tags</h4> */}
      <ul className="flex flex-col gap-2 mb-4">
        {data.map((record, i) => (
          <li
            key={
              dimensions
                ? `taglist-${dimensions.y}-${dimensions.x}-${i}`
                : `taglist-${i}`
            }
            className="grid grid-cols-[6rem_3fr] gap-2"
          >
            <span
              className="text-sm cursor-pointer"
              onClick={() => {
                setFilters({
                  ...filters,
                  tags: [record[0]],
                  position: dimensions
                    ? [{ x: dimensions.x, y: dimensions.y }]
                    : filters.position,
                });
                handler(true);
              }}
            >
              {record[0]}
            </span>
            <div className="flex gap-2">
              <span
                className="w-8 text-right cursor-pointer"
                onClick={() => {
                  handler(true);
                  setFilters({
                    ...filters,
                    tags: [record[0]],
                    position: dimensions
                      ? [{ x: dimensions.x, y: dimensions.y }]
                      : filters.position,
                  });
                }}
              >
                {record[1]}
              </span>
              <div className="w-full flex">
                <div
                  className="bg-neutral-500 rounded-sm cursor-pointer"
                  style={{
                    width: ((record[1] / baseline) * 100).toString() + "%",
                  }}
                  onClick={() => {
                    handler(true);
                    setFilters({
                      ...filters,
                      tags: [record[0]],
                      position: dimensions
                        ? [{ x: dimensions.x, y: dimensions.y }]
                        : filters.position,
                    });
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
