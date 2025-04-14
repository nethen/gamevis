"use client";
import Image from "next/image";
import meta from "@/app/meta.json";
import data from "@/app/sorted_output.json";
import { useEffect, useMemo, useState } from "react";

const uniqueGenres = [...new Set(meta.map((item) => item.genre))];

export default function Page() {
  const [relative, setRelativity] = useState("Screen");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRelativity(localStorage.getItem("relativity") || "Screen");
      setSelectedOption(localStorage.getItem("game") || "");
      setSelectedGenre(localStorage.getItem("genre") || "");
    }
  }, []);

  const filteredMetadata = useMemo(() => {
    return meta
      .filter((item) => {
        if (selectedGenre == "") return true;
        return item.genre == selectedGenre;
      })
      .map((item) => {
        return item.id.toString();
      });
  }, [selectedGenre]);

  const filteredGameNames = useMemo(() => {
    return meta
      .filter((item) => {
        if (selectedGenre == "") return true;
        return item.genre == selectedGenre;
      })
      .map((item) => {
        return item.name;
      });
  }, [selectedGenre]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return filteredMetadata.includes(item.game_id);
    });
  }, [filteredMetadata]);
  // console.log(meta);
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

  useEffect(() => {
    console.log(filteredMetadata);
  }, [selectedGenre]);
  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);

  return (
    <div className="flex fixed inset-0">
      <nav className="p-8 overflow-auto min-w-[20rem]">
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
              className={`px-4 py-2 rounded-md border border-neutral-500 ${
                relative == "Screen" ? "bg-neutral-500" : "bg-transparent"
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
              className={`px-4 py-2 rounded-md border border-neutral-500 ${
                relative == "Relative" ? "bg-neutral-500" : "bg-transparent"
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
                        : undefined;
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
      <main className="grid grid-cols-3 grid-rows-3 gap-4 h-full max-h-screen p-8 w-full relative">
        {["Top", "Middle", "Bottom"].map((yDimension) => {
          const filterY = filteredData.filter((item) =>
            item.vis_position && relative == "Screen"
              ? "screen_position" in item.vis_position &&
                Array.isArray(item.vis_position.screen_position) &&
                item.vis_position.screen_position[0] == yDimension
              : "relative_position" in item.vis_position &&
                Array.isArray(item.vis_position.relative_position) &&
                item.vis_position.relative_position[0] == yDimension
          );

          return ["Left", "Middle", "Right"].map((xDimension) => {
            const filterXY = filterY.filter((item) =>
              item.vis_position && relative == "Screen"
                ? "screen_position" in item.vis_position &&
                  Array.isArray(item.vis_position.screen_position) &&
                  item.vis_position.screen_position[1] == xDimension
                : "relative_position" in item.vis_position &&
                  Array.isArray(item.vis_position.relative_position) &&
                  item.vis_position.relative_position[1] == xDimension
            );
            return (
              <section
                className="bg-neutral-900 p-4 flex flex-col gap-2"
                key={`section-${yDimension.toLowerCase()}-${xDimension.toLowerCase()}`}
              >
                <span>
                  {
                    filterXY.filter(
                      (item) =>
                        selectedOption == "" || item.game_id == selectedOption
                    ).length
                  }{" "}
                  items
                </span>
                {
                  <ul className="flex flex-wrap gap-4 size-full overflow-auto">
                    {filterXY
                      .filter(
                        (item) =>
                          selectedOption == "" || item.game_id == selectedOption
                      )
                      .map((item, i) => (
                        <li key={i} className="">
                          <span>
                            {item.game_id +
                              "_" +
                              item.screenshot_id +
                              "_" +
                              item.vis_id}
                          </span>
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
                }
              </section>
            );
          });
        })}
      </main>
    </div>
  );
}
