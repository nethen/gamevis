"use client";
import Image from "next/image";
import meta from "@/app/meta.json";
import data from "@/app/data.json";
import { useState } from "react";

const uniqueGenres = [...new Set(meta.map((item) => item.genre))];
const sortedData = data.sort((a, b) => {
  return Number(a.game_id) - Number(b.game_id);
});

export default function Page() {
  const [selectedOption, setSelectedOption] = useState("");
  // console.log(meta);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    console.log("Selected:", e.target.value);
  };

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
          <ul>
            {uniqueGenres ? (
              uniqueGenres.map((item) => <li key={item}>{item}</li>)
            ) : (
              <p>Loading genres</p>
            )}
          </ul>
        </div>
      </nav>
      <main className="grid grid-cols-3 grid-rows-3 gap-4 h-full max-h-screen p-8 w-full relative">
        {["Top", "Middle", "Bottom"].map((yDimension) => {
          const filterY = sortedData.filter(
            (item) =>
              item.vis_position &&
              "screen_position" in item.vis_position &&
              Array.isArray(item.vis_position.screen_position) &&
              item.vis_position.screen_position[0] == yDimension
          );

          return ["Left", "Middle", "Right"].map((xDimension) => {
            const filterXY = filterY.filter(
              (item) =>
                item.vis_position &&
                "screen_position" in item.vis_position &&
                Array.isArray(item.vis_position.screen_position) &&
                item.vis_position.screen_position[1] == xDimension
            );
            return (
              <section
                className="overflow-auto bg-neutral-900 p-4"
                key={`section-${yDimension.toLowerCase()}-${xDimension.toLowerCase()}`}
              >
                <ul className="gap-4">
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
              </section>
            );
          });
        })}
      </main>
    </div>
  );
}
