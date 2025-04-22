"use client";
// import Image from "next/image";
import { Annotation, Metadata } from "./utils/types/types";
import rawMeta from "@/app/data/meta.json";
import rawData from "@/app/data/inprogress_data.json";
const data: Annotation[] = rawData as unknown as Annotation[];
const meta: Metadata[] = rawMeta as unknown as Metadata[];
import { useMemo, useState } from "react";
import {
  FilterNav,
  useFilterContext,
} from "./components/Nav/FilterNav/FilterNav";
import { TagGraph } from "./components/Vis/TagGraph";
import { X_DIMENSIONS, Y_DIMENSIONS, XY_KEYS } from "./utils/types/types";
import { EnlargedView } from "./components/EnlargedView/EnlargedView";
import { getTags } from "./utils/methods/methods";
import { SpatialNav } from "./components/Nav/SpatialNav/SpatialNav";

export default function Page() {
  const { filters, setFilters } = useFilterContext();
  const [grouping, setGrouping] = useState("spatial");
  const [modalOpen, setModalOpen] = useState(false);

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

  const filteredData = useMemo(() => {
    const result = data
      .filter((item) =>
        filters.coords.length > 0
          ? filters.coords.includes(item.vis_position.coords)
          : true
      )
      .filter((item) =>
        filters.relativity.length > 0
          ? filters.relativity.includes(item.vis_position.screen_relativity)
          : true
      )
      .filter((item) =>
        filteredMetadata.some((subitem) => subitem.id == item.game_id)
      )
      .filter((item) =>
        filters.game != "" ? item.game_id == filters.game : true
      )
      .filter((item) =>
        filters.position.length > 0
          ? filters.position.some((pos) =>
              "relative_position" in item.vis_position
                ? item.vis_position.relative_position?.[0] == pos.y &&
                  item.vis_position.relative_position[1] == pos.x
                : item.vis_position.screen_position?.[0] == pos.y &&
                  item.vis_position.screen_position[1] == pos.x
            )
          : true
      );
    return result;
  }, [filteredMetadata, filters]);

  const spatializedData = useMemo(() => {
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
  }, [filteredData]);

  const tagStats = useMemo(() => {
    // console.log(filteredData);
    // console.log(filteredData.map((array) => getTags(array)));
    return {
      linear: {
        value: getTags(filteredData),
        max:
          getTags(filteredData)[0] == undefined
            ? 0
            : getTags(filteredData)[0][1],
      },
      spatial: {
        value: spatializedData.map((array) => getTags(array)),
        max: Math.max(
          ...spatializedData
            .map((array) => getTags(array))
            .map((array) => {
              // console.log(array[0]);
              if (array[0] == undefined) return 0;
              return array[0][1];
            })
        ),
      },
    };
  }, [filteredData]);
  // console.log(meta);

  // useEffect(() => {
  //   console.log("Filtered data:", filteredData);
  //   console.log("Filtered metadata:", filteredMetadata);
  // }, [filteredData, filteredMetadata]);

  // useEffect(() => {
  //   console.log(tagStats);
  // }, [tagStats]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex fixed inset-0">
      <nav
        className={`overflow-auto border-r border-neutral-800 ${
          sidebarOpen ? "w-[24rem] px-4" : "w-12"
        } transition-all duration-300 ease-in-out`}
      >
        <hgroup className="flex justify-between items-center h-20 pt-8 pb-2 sticky top-0 text-sm bg-background z-20 font-semibold tracking-wider text-foreground/50">
          {sidebarOpen && <h2 className="cursor-pointer">Games</h2>}
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
        <SpatialNav
          data={spatializedData}
          value={grouping}
          handler={setGrouping}
          options={["linear", "spatial"]}
        />
      </nav>
      <main className="max-h-screen w-full relative flex flex-col">
        <FilterNav meta={meta} />
        <div className="p-4 grid grid-rows-3 grid-cols-3 gap-8 h-full min-h-[40rem]">
          {grouping == "spatial" ? (
            ["Top", "Middle", "Bottom"].map((yDimension, y) => {
              return ["Left", "Middle", "Right"].map((xDimension, x) => {
                return (
                  <section
                    className={`flex flex-col gap-2 ${
                      spatializedData[x + 3 * y].length > 0 ? "" : "opacity-10"
                    }`}
                    key={`section-${yDimension.toLowerCase()}-${xDimension.toLowerCase()}`}
                  >
                    {spatializedData[x + 3 * y].length > 0 && (
                      <>
                        <hgroup className="flex justify-between mb-2">
                          <h3 className="text-lg font-medium">
                            {yDimension}{" "}
                            {xDimension != yDimension ? xDimension : null}
                          </h3>
                          {spatializedData[x + 3 * y].length > 0 && (
                            <div className="flex gap-4">
                              <div className="text-sm font-semibold text-right">
                                <span className="text-foreground/50">
                                  Listing
                                </span>{" "}
                                <br />
                                <span>
                                  {spatializedData[x + 3 * y].length} snapshot
                                  {spatializedData[x + 3 * y].length == 1
                                    ? ""
                                    : "s"}
                                </span>
                              </div>
                              <button
                                className="px-3 leading-0 rounded-full bg-neutral-500 font-bold text-sm cursor-pointer"
                                onClick={() => {
                                  setFilters({
                                    ...filters,
                                    position: [
                                      { y: yDimension, x: xDimension },
                                    ],
                                  });
                                  setModalOpen(true);
                                }}
                              >
                                View all
                              </button>
                            </div>
                          )}
                        </hgroup>

                        <div className="overflow-auto size-full flex flex-col p-4 bg-neutral-900 divide-neutral-700 divide-y">
                          <TagGraph
                            data={tagStats.spatial.value[x + 3 * y]}
                            dimensions={{ x: xDimension, y: yDimension }}
                            baseline={tagStats.spatial.max}
                            handler={setModalOpen}
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
            })
          ) : (
            <section
              className={`flex flex-col gap-2 col-span-full row-span-full`}
              key={`section-all`}
            >
              <hgroup className="flex justify-between mb-2">
                <h3 className="text-lg font-medium">All data</h3>
                {filteredData.flat().length > 0 && (
                  <div className="flex gap-4">
                    <div className="text-sm font-semibold text-right">
                      <span className="text-foreground/50">Listing</span> <br />
                      <span>
                        {filteredData.flat().length} snapshot
                        {filteredData.flat().length == 1 ? "" : "s"}
                      </span>
                    </div>
                    <button
                      className="px-3 leading-0 rounded-full bg-neutral-500 font-bold text-sm cursor-pointer"
                      onClick={() => {
                        setModalOpen(true);
                      }}
                    >
                      View all
                    </button>
                  </div>
                )}
              </hgroup>

              <div className="overflow-auto size-full flex flex-col p-4 bg-neutral-900 divide-neutral-700 divide-y">
                <TagGraph
                  data={tagStats.linear.value}
                  baseline={tagStats.linear.max}
                  handler={setModalOpen}
                />
              </div>
            </section>
          )}
        </div>
      </main>
      {modalOpen ? (
        <EnlargedView data={filteredData} handler={setModalOpen} />
      ) : null}
    </div>
  );
}
