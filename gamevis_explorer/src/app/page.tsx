"use client";
// import Image from "next/image";
import { Annotation, Metadata } from "./utils/types/types";
import rawMeta from "@/app/data/meta.json";
import rawData from "@/app/data/inprogress_data.json";
const data: Annotation[] = rawData as unknown as Annotation[];
const meta: Metadata[] = rawMeta as unknown as Metadata[];
import { useEffect, useMemo, useState } from "react";
import { FilterNav, useFilterContext } from "./components/Nav/FilterNav";
import { TagGraph } from "./components/Vis/TagGraph";
import { X_DIMENSIONS, Y_DIMENSIONS } from "./utils/types/types";
import { EnlargedView } from "./components/EnlargedView/EnlargedView";
import { getTags } from "./utils/methods/methods";

export default function Page() {
  const { filters, setFilters } = useFilterContext();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setFilters({
  //       ...filters,
  //       coords: localStorage.getItem("coords") || ["Camera"],
  //       relative: localStorage.getItem("relativity") || ["Screen"],
  //       genre: localStorage.getItem("genre") || [""],
  //       game: localStorage.getItem("game") || "",
  //     });
  //   }
  // }, []);

  const filteredMetadata = useMemo(() => {
    return meta
      .filter((item) => {
        if (filters.genre.length == 0)
          return (
            item.score >= filters.speed[0] && item.score <= filters.speed[1]
          );
        return (
          filters.genre.includes(item.genre) &&
          item.score >= filters.speed[0] &&
          item.score <= filters.speed[1]
        );
      })
      .map((item) => {
        return {
          id: item.id.toString(),
          name: item.name.toString(),
        };
      });
  }, [filters]);

  const filteredData = useMemo<Annotation[][]>(() => {
    const result = Object.keys(Y_DIMENSIONS)
      .filter((v) => isNaN(Number(v)))
      .flatMap((yDimension, i) =>
        Object.keys(X_DIMENSIONS)
          .filter((v) => isNaN(Number(v)))
          .map((xDimension, j) => {
            // console.log(yDimension);
            // console.log(xDimension);
            return data
              .filter((item) =>
                filters.coords.length > 0
                  ? filters.coords.includes(item.vis_position.coords)
                  : true
              )
              .filter((item) =>
                filters.relativity.length > 0
                  ? filters.relativity.includes(
                      item.vis_position.screen_relativity
                    )
                  : true
              )
              .filter((item) =>
                filteredMetadata.some((subitem) => subitem.id == item.game_id)
              )
              .filter((item) =>
                filters.game != "" ? item.game_id == filters.game : true
              )
              .filter((item) =>
                "relative_position" in item.vis_position
                  ? item.vis_position.relative_position?.[0] == yDimension &&
                    item.vis_position.relative_position[1] == xDimension
                  : item.vis_position.screen_position?.[0] == yDimension &&
                    item.vis_position.screen_position[1] == xDimension
              );
          })
      );
    return result;
  }, [filteredMetadata, filters]);

  const tagStats = useMemo(() => {
    // console.log(filteredData);
    // console.log(filteredData.map((array) => getTags(array)));
    return {
      value: filteredData.map((array) => getTags(array)),
      max: Math.max(
        ...filteredData
          .map((array) => getTags(array))
          .map((array) => {
            // console.log(array[0]);
            if (array[0] == undefined) return 0;
            return array[0][1];
          })
      ),
    };
  }, [filteredData]);
  // console.log(meta);

  useEffect(() => {
    console.log("Filtered data:", filteredData);
    console.log("Filtered metadata:", filteredMetadata);
  }, [filteredData, filteredMetadata]);

  useEffect(() => {
    console.log(tagStats);
  }, [tagStats]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex fixed inset-0">
      <nav
        className={`overflow-auto border-r border-neutral-800 ${
          sidebarOpen ? "w-[24rem] px-4" : "w-12"
        } transition-all duration-300 ease-in-out`}
      >
        <hgroup className="flex justify-between items-center h-20 pt-8 pb-2 sticky top-0 text-sm bg-background z-20 font-semibold tracking-wider text-foreground/50">
          {sidebarOpen && (
            <h2
              onClick={() => {
                setFilters({
                  ...filters,
                  position: ["All", "All"],
                });
              }}
              className="cursor-pointer"
            >
              Games
            </h2>
          )}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}
            className="size-8 bg-neutral-800 rounded-full"
          ></button>
        </hgroup>
        <div className="mb-8">
          <ul className="flex flex-col gap-4 mb-4 pb-16">
            {filteredMetadata.map((item, i) => {
              return (
                <li
                  key={`filtered-game-${i}`}
                  className={`cursor-pointer py-1 ${
                    filters.game === item.id || filters.game === ""
                      ? "opacity-100"
                      : "opacity-50"
                  } ${
                    filters.game === item.id
                      ? "bg-neutral-800 px-2 rounded-md"
                      : ""
                  }`}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      game: filters.game === item.id ? "" : item.id,
                    })
                  }
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
        {filters.relativity.includes("Relative") && (
          <div className="mb-8">
            <h2 className="text-lg mb-2">Anchors</h2>

            <ul className="flex flex-col gap-4 mb-4">
              {[
                ...new Set(
                  filteredData
                    .flat()
                    .filter(
                      (item) =>
                        filters.game == "" || item.game_id == filters.game
                    )
                    .filter(
                      (item) =>
                        item.vis_position &&
                        "screen_relativity" in item.vis_position &&
                        item.vis_position.screen_relativity == "Relative"
                    )
                    .map((item) => {
                      return item.vis_position &&
                        "relative_to" in item.vis_position
                        ? item.vis_position.relative_to
                        : null;
                    })
                ),
              ].map((item, i) => {
                return <li key={`anchor-${i}`}>{item}</li>;
              })}
            </ul>
          </div>
        )}
      </nav>
      <main className="max-h-screen w-full relative flex flex-col">
        <FilterNav meta={meta} />
        <div className="p-4 grid grid-rows-3 grid-cols-3 gap-8 h-full min-h-[40rem]">
          {["Top", "Middle", "Bottom"].map((yDimension, y) => {
            return ["Left", "Middle", "Right"].map((xDimension, x) => {
              return (
                <section
                  className={`flex flex-col gap-2 ${
                    filteredData[x + 3 * y].length > 0 ? "" : "opacity-10"
                  }`}
                  key={`section-${yDimension.toLowerCase()}-${xDimension.toLowerCase()}`}
                >
                  {filteredData[x + 3 * y].length > 0 && (
                    <>
                      <hgroup className="flex justify-between mb-2">
                        <h3 className="text-lg font-medium">
                          {yDimension}{" "}
                          {xDimension != yDimension ? xDimension : null}
                        </h3>
                        {filteredData[x + 3 * y].length > 0 && (
                          <div className="flex gap-4">
                            <div className="text-sm font-semibold text-right">
                              <span className="text-foreground/50">
                                Listing
                              </span>{" "}
                              <br />
                              <span>
                                {filteredData[x + 3 * y].length} snapshot
                                {filteredData[x + 3 * y].length == 1 ? "" : "s"}
                              </span>
                            </div>
                            <button
                              className="px-3 leading-0 rounded-full bg-neutral-500 font-bold text-sm cursor-pointer"
                              onClick={() => {
                                setFilters({
                                  ...filters,
                                  position: [yDimension, xDimension],
                                });
                              }}
                            >
                              View all
                            </button>
                          </div>
                        )}
                      </hgroup>

                      <div className="overflow-auto size-full flex flex-col p-4 bg-neutral-900 divide-neutral-700 divide-y">
                        <TagGraph
                          data={tagStats.value[x + 3 * y]}
                          dimensions={{ x: xDimension, y: yDimension }}
                          baseline={tagStats.max}
                        />
                        {/* {filters.game != "" || filters.genre.length > 0 ? (
                          <ul className="flex flex-wrap gap-4 size-full">
                            {filteredData[x + 3 * y]
                              .filter(
                                (item) =>
                                  filters.game == "" ||
                                  item.game_id == filters.game
                              )
                              .map((item, i) => (
                                <li key={i} className="">
                                  <hgroup>
                                    <h5>{item.vis_name}</h5>
                                    <span className="uppercase font-bold tracking-widest text-xs">
                                      {item.game_id +
                                        "_" +
                                        item.screenshot_id +
                                        "_" +
                                        item.vis_id}
                                    </span>
                                  </hgroup>
                                  <img
                                    loading="lazy"
                                    src={
                                      "/games/" +
                                      item.game_id +
                                      "_" +
                                      item.screenshot_id +
                                      "_" +
                                      item.vis_id +
                                      ".jpg"
                                    }
                                  /> 
                                </li>
                              ))}
                          </ul>
                        ) : null} */}
                      </div>
                    </>
                  )}
                </section>
              );
            });
          })}
        </div>
      </main>
      {filters.position[0] != "" && filters.position[1] != "" ? (
        <EnlargedView
          data={
            filters.position[0] == "All"
              ? filteredData.flat()
              : filteredData[
                  Object.keys(X_DIMENSIONS)
                    .filter((v) => isNaN(Number(v)))
                    .findIndex((v) => v == filters.position[1]) +
                    3 *
                      Object.keys(Y_DIMENSIONS)
                        .filter((v) => isNaN(Number(v)))
                        .findIndex((v) => v == filters.position[0])
                ]
          }
        />
      ) : null}
    </div>
  );
}
