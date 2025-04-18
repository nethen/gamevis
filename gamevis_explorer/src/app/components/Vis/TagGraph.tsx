import { Annotation } from "@/app/types/types";

export const TagGraph = ({
  data,
  dimensions,
}: {
  data: Annotation[];
  dimensions: { x: string; y: string };
}) => {
  const sortedData = Object.entries(
    data
      .flatMap((item) => item.tags || [])
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="">
      <h4 className="font-bold">Tags</h4>
      <ul className="flex flex-col gap-2 mb-4">
        {sortedData.map((record, i) => (
          <li
            key={`taglist-${dimensions.y}-${dimensions.x}-${i}`}
            className="grid grid-cols-[6rem_3fr] gap-2"
          >
            <span className="text-sm">{record[0]}</span>
            <div
              className="bg-neutral-500 rounded-full"
              style={{
                width: ((record[1] / sortedData[0][1]) * 100).toString() + "%",
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
