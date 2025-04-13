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
    <div className="flex">
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
      <main className="flex flex-col min-h-screen p-8 bg-red-500 w-full">
        <ul>
          {sortedData
            .filter(
              (item) => selectedOption == "" || item.game_id == selectedOption
            )
            .map((item, i) => (
              <li key={i}>
                {item.game_id + "_" + item.screenshot_id + "_" + item.vis_id}
              </li>
            ))}
        </ul>
      </main>
    </div>
  );
}
