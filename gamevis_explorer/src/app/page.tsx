"use client";
// import Image from "next/image";
import meta from "@/app/meta.json";
import rawData from "@/app/fixed_annotations.json";
const data: Annotation[] = rawData as unknown as Annotation[];
import { useEffect, useMemo, useState } from "react";
import { Annotation, VisUsage } from "./types/types";
import { FilterNav, useFilterContext } from "./components/Nav/FilterNav";
import { DEV_CLIENT_PAGES_MANIFEST } from "next/dist/shared/lib/constants";
import { TagGraph } from "./components/Vis/TagGraph";
import { X_DIMENSIONS, Y_DIMENSIONS } from "./types/types";

const uniqueGenres = [...new Set(meta.map((item) => item.genre))];

export default function Page() {
  const { filters, setFilters } = useFilterContext();

  const filterByXY = (
    data: Annotation[],
    yDimension: string,
    xDimension: string
  ) => {
    return data.filter((item) =>
      "relative_position" in item.vis_position
        ? item.vis_position.relative_position?.[0] == yDimension &&
          item.vis_position.relative_position[1] == xDimension
        : item.vis_position.screen_position?.[0] == yDimension &&
          item.vis_position.screen_position[1] == xDimension
    );
  };

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
            console.log(yDimension);
            console.log(xDimension);
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
    console.log(filteredData);
    console.log(
      filteredData.map((array) =>
        Object.entries(
          array
            .flatMap((item) => item.tags || [])
            .reduce((acc, tag) => {
              acc[tag] = (acc[tag] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])
      )
    );
    return {
      value: filteredData.map((array) =>
        Object.entries(
          array
            .flatMap((item) => item.tags || [])
            .reduce((acc, tag) => {
              acc[tag] = (acc[tag] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])
      ),
      max: Math.max(
        ...filteredData
          .map((array) =>
            Object.entries(
              array
                .flatMap((item) => item.tags || [])
                .reduce((acc, tag) => {
                  acc[tag] = (acc[tag] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1])
          )
          .map((array) => {
            console.log(array[0]);
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
          {sidebarOpen && <h2>Games</h2>}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}
            className="size-8 bg-neutral-800 rounded-full"
          ></button>
        </hgroup>
        <div className="mb-8">
          <ul className="flex flex-col gap-4 mb-4 px-8 pb-16">
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
        <FilterNav />
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
        <div className="fixed inset-0 bg-background/95 p-16 overflow-auto z-100">
          <div className="relative">
            <section className="sticky top-0 -mx-3 pl-6 p-2 bg-neutral-900 z-10 rounded-lg mb-8 flex gap-8 items-stretch">
              <hgroup>
                <h2 className="text-lg">
                  {filters.position[0]} {filters.position[1]}
                </h2>
                <p>
                  {
                    filterByXY(
                      filteredData[0],
                      filters.position[0],
                      filters.position[1]
                    ).length
                  }{" "}
                  annotations
                </p>
              </hgroup>
              <form
                className="flex gap-4"
                onChange={(e) => {
                  const formData = new FormData(e.currentTarget);
                  const selectedStates = Array.from(formData.entries()).map(
                    ([name, value]) => value.toString()
                  );
                  setFilters({ ...filters, usages: selectedStates });
                  console.log("Selected states:", selectedStates);
                }}
              >
                {["Player", "Enemy", "Game", "Environment"].map((item, i) => (
                  <div
                    key={`usage-check-${item.toLowerCase()}`}
                    className="flex gap-2 items-center"
                  >
                    <input type="checkbox" name={`state-${i}`} value={item} />
                    <label htmlFor={`state-${i}`}>
                      {item} (
                      {
                        filterByXY(
                          filteredData[0],
                          filters.position[0],
                          filters.position[1]
                        ).filter((subitem) =>
                          subitem.vis_usage.includes(item as VisUsage)
                        ).length
                      }
                      )
                    </label>
                    {}
                  </div>
                ))}
                {/* <div>
                  <input type="checkbox" name="state2" value="Enemy" />
                  <label htmlFor="state2">Enemy</label>
                </div>
                <div>
                  <input type="checkbox" name="state3" value="Environment" />
                  <label htmlFor="state3">Environment</label>
                </div>
                <div>
                  <input type="checkbox" name="state4" value="Game" />
                  <label htmlFor="state4">Game</label>
                </div> */}
              </form>
              <button
                className="ml-auto p-4 py-2 rounded-md bg-neutral-700 cursor-pointer"
                onClick={() => {
                  setFilters({ ...filters, position: ["", ""], usages: [] });
                }}
              >
                Close
              </button>
            </section>
            {[
              ...new Set(
                filteredData[
                  Object.keys(X_DIMENSIONS)
                    .filter((v) => isNaN(Number(v)))
                    .findIndex((v) => v == filters.position[1]) +
                    3 *
                      Object.keys(Y_DIMENSIONS)
                        .filter((v) => isNaN(Number(v)))
                        .findIndex((v) => v == filters.position[0])
                ].flatMap((item) =>
                  item.tags ? item.tags.map((tag) => tag) : "N/A"
                )
              ),
            ].map((tag) => (
              <div key={`tag-group-${tag}`} className="mb-12">
                <h3 className="text-xl border-t border-neutral-500">{tag}</h3>
                <ul className="flex flex-wrap gap-4 ">
                  {filteredData[
                    Object.keys(X_DIMENSIONS)
                      .filter((v) => isNaN(Number(v)))
                      .findIndex((v) => v == filters.position[1]) +
                      3 *
                        Object.keys(Y_DIMENSIONS)
                          .filter((v) => isNaN(Number(v)))
                          .findIndex((v) => v == filters.position[0])
                  ]

                    .filter((item) => item.tags?.includes(tag))
                    .map((item, i) => (
                      <li
                        key={"modal-item-" + i}
                        className={`${
                          filters.usages.length == 0 ||
                          item.vis_usage.some((usage) =>
                            filters.usages.includes(usage)
                          )
                            ? "-order-1 opacity-100"
                            : "opacity-10"
                        }`}
                      >
                        <hgroup
                          className={`${
                            filters.usages.length == 0 ||
                            item.vis_usage.some((usage) =>
                              filters.usages.includes(usage)
                            )
                              ? "opacity-100"
                              : "opacity-10"
                          }`}
                        >
                          <span className="uppercase font-bold tracking-widest text-xs">
                            {item.game_id +
                              "_" +
                              item.screenshot_id +
                              "_" +
                              item.vis_id}
                          </span>
                          <div className="flex gap-4 items-center">
                            <h5 className="text-lg">{item.vis_name}</h5>
                            <ul className="flex gap-2">
                              {item.vis_usage.map((usage, i) => (
                                <li
                                  key={i}
                                  className={`px-2 bg-neutral-800 rounded-full leading-none flex`}
                                >
                                  <span className="text-sm">
                                    {usage == "Environment"
                                      ? "Ev"
                                      : usage.substring(0, 2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </hgroup>
                        <img
                          loading="lazy"
                          className={`
                      mb-4`}
                          // className={`${item.vis_usage.includes(
                          //   "Player`"
                          // )} ? "bg-red-500" : ""`}
                          src={
                            "/games/" +
                            item.game_id +
                            "_" +
                            item.screenshot_id +
                            "_" +
                            item.vis_id +
                            ".jpg"
                          }
                          alt={item.notes.join(", ")}
                        />

                        <ul className="flex flex-wrap gap-4">
                          {item.data.map((dataGroup, i) => (
                            <li key={i} className={`flex flex-col`}>
                              <div className="text-sm flex flex-col flex-wrap">
                                {dataGroup.map((data, j) => (
                                  <span
                                    key={j}
                                    className={`
                                ${
                                  data.data_type == "Nominal"
                                    ? "text-red-400"
                                    : data.data_type == "Ordinal"
                                    ? "text-amber-400"
                                    : data.data_type == "Quantitative"
                                    ? "text-blue-400"
                                    : data.data_type == "Spatial"
                                    ? "text-green-400"
                                    : data.data_type == "Temporal"
                                    ? "text-purple-400"
                                    : "text-foreground"
                                } font-bold`}
                                  >
                                    {data.data_value}
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm opacity-50">
                                M:{" "}
                                {Array.isArray(item.marks[i])
                                  ? item.marks[i].map((item) => item).join(", ")
                                  : "N/A"}
                              </span>
                              <span className="text-sm opacity-50">
                                C:{" "}
                                {Array.isArray(item.channels[i])
                                  ? item.channels[i]
                                      .map((item) => item)
                                      .join(", ")
                                  : "N/A"}
                              </span>
                              <span className="text-sm opacity-50">
                                T:{" "}
                                {item.tags
                                  ? item.tags.map((item) => item).join(", ")
                                  : "N/A"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
