import { Annotation } from "@/app/utils/types/types";

export const TagGraph = ({
  data,
  dimensions,
  baseline,
}: {
  data: [string, number][];
  dimensions: { x: string; y: string };
  baseline: number;
}) => {
  return (
    <div className="">
      {/* <h4 className="font-bold">Tags</h4> */}
      <ul className="flex flex-col gap-2 mb-4">
        {data.map((record, i) => (
          <li
            key={`taglist-${dimensions.y}-${dimensions.x}-${i}`}
            className="grid grid-cols-[6rem_3fr] gap-2"
          >
            <span className="text-sm">{record[0]}</span>
            <div className="flex gap-2">
              <span className="w-8 text-right">{record[1]}</span>
              <div className="w-full flex">
                <div
                  className="bg-neutral-500 rounded-sm"
                  style={{
                    width: ((record[1] / baseline) * 100).toString() + "%",
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
