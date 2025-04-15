"use client";
// import Image from "next/image";
import meta from "@/app/meta.json";
import rawData from "@/app/fixed_annotations.json";
const data: Annotation[] = rawData as unknown as Annotation[];
import { useEffect, useMemo, useState } from "react";
import { Annotation, VisUsage } from "./types/types";

const uniqueGenres = [...new Set(meta.map((item) => item.genre))];

export default function Page() {
  const [coords, setCoords] = useState("Camera");
  const [relative, setRelativity] = useState("Screen");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedSection, setSelectedSection] = useState(["", ""]);
  const [selectedUsages, setSelectedUsages] = useState<string[]>([]);
  const [speed, setSpeed] = useState([4, 12]);

  const filterByXY = (
    data: Annotation[],
    yDimension: string,
    xDimension: string
  ) => {
    return data.filter((item) =>
      item.vis_position && relative == "Screen"
        ? "screen_position" in item.vis_position &&
          Array.isArray(item.vis_position.screen_position) &&
          item.vis_position.screen_position[0] == yDimension &&
          item.vis_position.screen_position[1] == xDimension
        : "relative_position" in item.vis_position &&
          Array.isArray(item.vis_position.relative_position) &&
          item.vis_position.relative_position[0] == yDimension &&
          item.vis_position.relative_position[1] == xDimension
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCoords(localStorage.getItem("coords") || "Camera");
      setRelativity(localStorage.getItem("relativity") || "Screen");
      setSelectedOption(localStorage.getItem("game") || "");
      setSelectedGenre(localStorage.getItem("genre") || "");
    }
  }, []);

  const filteredMetadata = useMemo(() => {
    return meta
      .filter((item) => {
        if (selectedGenre == "")
          return item.score >= speed[0] && item.score <= speed[1];
        return (
          item.genre == selectedGenre &&
          item.score >= speed[0] &&
          item.score <= speed[1]
        );
      })
      .map((item) => {
        return item.id.toString();
      });
  }, [selectedGenre, speed]);

  const filteredGameNames = useMemo(() => {
    return meta
      .filter((item) => {
        if (selectedGenre == "")
          return item.score >= speed[0] && item.score <= speed[1];
        return (
          item.genre == selectedGenre &&
          item.score >= speed[0] &&
          item.score <= speed[1]
        );
      })
      .map((item) => {
        return item.name;
      });
  }, [selectedGenre, speed]);

  const filteredData = useMemo<Annotation[]>(() => {
    return data.filter((item) => {
      return (
        filteredMetadata.includes(item.game_id) &&
        (item.game_id == selectedOption || selectedOption == "") &&
        item.vis_position.coords == coords
      );
    });
  }, [filteredMetadata, selectedOption, coords]);

  // console.log(meta);
  const handleCoordsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCoords(e.target.value);
    try {
      localStorage.setItem("coords", e.target.value);
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
    console.log("Selected:", e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    try {
      localStorage.setItem("game", e.target.value);
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
    console.log("Selected:", e.target.value);
  };
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    try {
      localStorage.setItem("genre", e.target.value);
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
    console.log("Selected:", e.target.value);
  };

  return (
    <div className="flex fixed inset-0">
      <nav className="p-8 overflow-auto min-w-[20rem] border-r border-neutral-900">
        <div className="mb-8">
          <h2 className="text-lg mb-2">Coordinate system</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCoords("Camera");
                try {
                  localStorage.setItem("coords", "Camera");
                } catch (error) {
                  console.error("Error saving to localStorage", error);
                }
              }}
              className={`w-full px-4 py-2 rounded-md border border-neutral-700 cursor-pointer ${
                coords == "Camera" ? "bg-neutral-700" : "bg-transparent"
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => {
                setCoords("World");
                try {
                  localStorage.setItem("coords", "World");
                } catch (error) {
                  console.error("Error saving to localStorage", error);
                }
              }}
              className={`w-full px-4 py-2 rounded-md border border-neutral-700 cursor-pointer ${
                coords == "World" ? "bg-neutral-700" : "bg-transparent"
              }`}
            >
              World
            </button>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg mb-2">Relativity</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setRelativity("Screen");
                try {
                  localStorage.setItem("relativity", "Screen");
                } catch (error) {
                  console.error("Error saving to localStorage", error);
                }
              }}
              className={`w-full px-4 py-2 rounded-md border border-neutral-700 cursor-pointer ${
                relative == "Screen" ? "bg-neutral-700" : "bg-transparent"
              }`}
            >
              Screen
            </button>
            <button
              onClick={() => {
                setRelativity("Relative");
                try {
                  localStorage.setItem("relativity", "Relative");
                } catch (error) {
                  console.error("Error saving to localStorage", error);
                }
              }}
              className={`w-full px-4 py-2 rounded-md border border-neutral-700 cursor-pointer ${
                relative == "Relative" ? "bg-neutral-700" : "bg-transparent"
              }`}
            >
              Relative
            </button>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg">Genres</h2>
          <select onChange={handleGenreChange} value={selectedGenre || ""}>
            <option value="" className="text-background/50">
              All genres
            </option>
            {uniqueGenres.map((item) => (
              <option key={item} value={item} className="text-background p-2">
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-8">
          <h2 className="text-lg">Speed</h2>
          <form>
            <div className="flex gap-4">
              <label htmlFor="speed" className="opacity-50">
                Min
              </label>
              <input
                type="number"
                name="speed-min"
                id="speed"
                defaultValue={4}
                min={4}
                max={12}
                onChange={(e) => {
                  setSpeed([parseInt(e.target.value), speed[1]]);
                }}
              />
            </div>
            <div className="flex gap-4">
              <label htmlFor="speed" className="opacity-50">
                Max
              </label>
              <input
                type="number"
                name="speed-max"
                id="speed"
                defaultValue={12}
                min={4}
                max={12}
                onChange={(e) => {
                  setSpeed([speed[0], parseInt(e.target.value)]);
                }}
              />
            </div>
          </form>
        </div>

        <div className="mb-8">
          <h2 className="text-lg mb-2">Games</h2>

          <ul className="flex flex-col gap-4 mb-4">
            {filteredGameNames.map((item, i) => {
              return <li key={`filtered-game-${i}`}>{item}</li>;
            })}
          </ul>
          <select
            onChange={handleChange}
            value={selectedOption || ""}
            className="bg-neutral-900 p-2 pr-0 w-full"
          >
            <option value="" className="">
              Select a game
            </option>
            {filteredGameNames.map((item, i) => (
              <option key={item} value={filteredMetadata[i]} className=" ">
                {item}
              </option>
            ))}
          </select>
        </div>
        {relative == "Relative" && (
          <div className="mb-8">
            <h2 className="text-lg mb-2">Anchors</h2>

            <ul className="flex flex-col gap-4 mb-4">
              {[
                ...new Set(
                  filteredData
                    .filter(
                      (item) =>
                        selectedOption == "" || item.game_id == selectedOption
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
            {/* <select
              onChange={handleChange}
              value={selectedOption || ""}
              className="bg-neutral-900 p-2 pr-0 w-full"
            >
              <option value="" className="">
                Select a game
              </option>
              {filteredGameNames.map((item, i) => (
                <option key={item} value={filteredMetadata[i]} className=" ">
                  {item}
                </option>
              ))}
            </select> */}
          </div>
        )}
      </nav>
      <main className="grid grid-rows-[min-content_repeat(3,_minmax(0,_1fr))] grid-cols-3 gap-4 h-full max-h-screen p-8 w-full relative">
        <nav className="p-2 col-span-full flex gap-4">
          <section>
            <h2>Data types</h2>
            <form
              className="flex gap-4"
              onChange={(e) => {
                const formData = new FormData(e.currentTarget);
                const selectedStates = Array.from(formData.entries()).map(
                  ([name, value]) => value.toString()
                );
                setSelectedUsages(selectedStates);
                console.log("Selected states:", selectedStates);
              }}
            >
              {[
                "Nominal",
                "Ordinal",
                "Quantitative",
                "Spatial",
                "Temporal",
              ].map((item, i) => (
                <div
                  key={`type-check-${item.toLowerCase()}`}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="checkbox"
                    name={`type-check__box-${item.toLowerCase()}`}
                    value={item}
                  />
                  <label htmlFor={`type-check__label-${item.toLowerCase()}`}>
                    {item} (
                    {
                      filteredData.filter((subitem) =>
                        subitem.vis_usage.includes(item as VisUsage)
                      ).length
                    }
                    )
                  </label>
                  {}
                </div>
              ))}
            </form>
          </section>
          {/* <button>Tags</button>
          <button>Images</button> */}
        </nav>
        {["Top", "Middle", "Bottom"].map((yDimension) => {
          return ["Left", "Middle", "Right"].map((xDimension) => {
            return (
              <section
                className="bg-neutral-900 p-4 flex flex-col gap-2"
                key={`section-${yDimension.toLowerCase()}-${xDimension.toLowerCase()}`}
              >
                <hgroup className="flex justify-between items-center">
                  <h3 className="">
                    {yDimension} {xDimension != yDimension ? xDimension : null}{" "}
                    &mdash;{" "}
                    {
                      filterByXY(filteredData, yDimension, xDimension).filter(
                        (item) =>
                          selectedOption == "" || item.game_id == selectedOption
                      ).length
                    }
                  </h3>
                  <button
                    className="px-3 py-1 rounded-sm bg-neutral-500 uppercase font-bold tracking-widest text-xs cursor-pointer"
                    onClick={() => {
                      setSelectedSection([yDimension, xDimension]);
                    }}
                  >
                    View all
                  </button>
                </hgroup>
                <div className="overflow-auto size-full flex flex-col divide-neutral-700 divide-y *:py-2">
                  <div className="">
                    <h4 className="font-bold">Tags</h4>
                    <ul>
                      {Object.entries(
                        filterByXY(filteredData, yDimension, xDimension)
                          .flatMap((item) => item.tags || [])
                          .reduce((acc, tag) => {
                            acc[tag] = (acc[tag] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                        .map(([tag, count], i) => (
                          <li key={`taglist-${yDimension}-${xDimension}-${i}`}>
                            <span className="text-sm">
                              {tag}: {count}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  {selectedOption != "" || selectedGenre != "" ? (
                    <ul className="flex flex-wrap gap-4 size-full">
                      {filterByXY(filteredData, yDimension, xDimension)
                        .filter(
                          (item) =>
                            selectedOption == "" ||
                            item.game_id == selectedOption
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
                            {/* <img
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
                            /> */}
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            );
          });
        })}
      </main>
      {selectedSection[0] != "" && selectedSection[1] != "" ? (
        <div
          className="fixed inset-0 bg-background/95 p-16 overflow-auto"
          onClick={() => {
            setSelectedSection(["", ""]);
            setSelectedUsages([]);
          }}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <section className="sticky top-0 -mx-3 pl-6 p-2 bg-neutral-900 z-10 rounded-lg mb-8 flex gap-8 items-stretch">
              <hgroup>
                <h2 className="text-lg">
                  {selectedSection[0]} {selectedSection[1]}
                </h2>
                <p>
                  {
                    filterByXY(
                      filteredData,
                      selectedSection[0],
                      selectedSection[1]
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
                  setSelectedUsages(selectedStates);
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
                          filteredData,
                          selectedSection[0],
                          selectedSection[1]
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
                  setSelectedSection(["", ""]);
                  setSelectedUsages([]);
                }}
              >
                Close
              </button>
            </section>
            <ul className="flex flex-wrap gap-4 ">
              {filterByXY(
                filteredData,
                selectedSection[0],
                selectedSection[1]
              ).map((item, i) => (
                <li
                  key={"modal-item-" + i}
                  className={`${
                    selectedUsages.length == 0 ||
                    item.vis_usage.some((usage) =>
                      selectedUsages.includes(usage)
                    )
                      ? "-order-1"
                      : ""
                  }`}
                >
                  <hgroup
                    className={`${
                      selectedUsages.length == 0 ||
                      item.vis_usage.some((usage) =>
                        selectedUsages.includes(usage)
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
                            className={`px-2 bg-neutral-800 rounded-full leading-none flex ${
                              selectedUsages.length == 0 ||
                              selectedUsages.includes(usage)
                                ? "opacity-100"
                                : "opacity-10"
                            }`}
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
                    className={`${
                      selectedUsages.length > 0 &&
                      !selectedUsages.some((usage) =>
                        item.vis_usage.includes(usage as VisUsage)
                      )
                        ? "opacity-10"
                        : ""
                    } 
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
                      <li key={i} className={`px-2 flex flex-col`}>
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
                          M: {item.marks[i].map((marks) => marks).join(", ")}
                        </span>
                        <span className="text-sm opacity-50">
                          C:{" "}
                          {item.channels[i]
                            .map((channel) => channel)
                            .join(", ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
