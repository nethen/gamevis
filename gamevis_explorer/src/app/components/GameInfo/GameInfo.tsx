"use client";

import { fetchInfo } from "@/app/utils/methods/actions"; // adjust if you're using ID
import { useEffect, useState } from "react";

type Props = {
  gameName: string;
};

export default function GameInfo({ gameName }: Props) {
  const [game, setGame] = useState<any | null>(null);

  useEffect(() => {
    const getGame = async () => {
      if (!gameName) return;
      try {
        const result = await fetchInfo(gameName);
        setGame(result);
      } catch (err) {
        console.error("Failed to fetch game info:", err);
      }
    };

    getGame();
  }, [gameName]);

  function decodeHtmlEntities(input: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = input;
    return txt.value;
  }

  function cleanHtmlDescription(raw: string): string {
    const decoded = decodeHtmlEntities(raw);
    return decoded
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim();
  }


  if (!game) return <p>Loading game info...</p>;
  const plainDescription = cleanHtmlDescription(game.description);

  return (
    <div className="p-4 border-b border-neutral-800">
      <h1 className="text-xl font-bold mb-2">{game.name}</h1>
      <img
        src={game.background_image}
        alt={game.name}
        className="w-full max-w-md rounded-lg mb-2"
      />
      <p className="whitespace-pre-wrap text-sm text-foreground/70 mb-2 max-w-[100ch]">
        {plainDescription}
      </p>
      <p className="text-xs">Released: {game.released}</p>
      <p className="text-xs">Rating: {game.rating}</p>
    </div>
  );
}
