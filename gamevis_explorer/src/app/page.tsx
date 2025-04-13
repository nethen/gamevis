"use client";
import Image from "next/image";
import meta from "@/app/meta.json";
import data from "@/app/sorted_output.json";
import { useEffect, useMemo, useState } from "react";

const uniqueGenres = [...new Set(meta.map((item) => item.genre))];

const sortedData = data.sort((a, b) => {
  return Number(a.game_id) - Number(b.game_id);
});

export default function Page() {
  const [relative, setRelativity] = useState("Screen");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
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

  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      return filteredMetadata.includes(item.game_id);
    });
  }, [filteredMetadata]);
  // console.log(meta);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    console.log("Selected:", e.target.value);
  };
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
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
      <nav className="p-8">
        <div className="mb-8">
          <h2 className="text-lg">Games</h2>
          <select onChange={handleChange} value={selectedOption}>
            <option value="" className="text-background/50">
              Select a game
            </option>
            {meta.map((item) => (
              <option key={item.id} value={item.id} className="text-background">
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-8">
          <h2 className="text-lg">Genres</h2>
          <select onChange={handleGenreChange} value={selectedGenre}>
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
          <h2 className="text-lg mb-2">Relativity</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setRelativity("Screen")}
              className={`px-4 py-2 rounded-md border border-neutral-500 ${
                relative == "Screen" ? "bg-neutral-500" : "bg-transparent"
              }`}
            >
              Screen
            </button>
            <button
              onClick={() => setRelativity("Relative")}
              className={`px-4 py-2 rounded-md border border-neutral-500 ${
                relative == "Relative" ? "bg-neutral-500" : "bg-transparent"
              }`}
            >
              Relative
            </button>
          </div>
        </div>
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
                    {filterXY.map((item, i) => (
                      <li key={i} className="">
                        <span>
                          {item.game_id +
                            "_" +
                            item.screenshot_id +
                            "_" +
                            item.vis_id}
                        </span>
                        <img
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
