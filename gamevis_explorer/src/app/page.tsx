import Image from "next/image";
import meta from "@/app/meta.json";
import data from "@/app/data.json";

const uniqueGenres = [...new Set(meta.map((item) => item.genre))];
const sortedData = data.sort((a, b) => {
  return Number(a.game_id) - Number(b.game_id);
});

export default function Page() {
  // console.log(meta);
  return (
    <div className="flex">
      <nav>
        <div className="mb-8">
          <h2 className="text-lg">Games</h2>
          <ul>
            {meta.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
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
      <main className="flex flex-col items-center justify-center min-h-screen p-24 text-center bg-red-500 w-full">
        <ul>
          {sortedData.map((item, i) => (
            <li key={i}>
              {item.game_id + "_" + item.screenshot_id + "_" + item.vis_id}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
