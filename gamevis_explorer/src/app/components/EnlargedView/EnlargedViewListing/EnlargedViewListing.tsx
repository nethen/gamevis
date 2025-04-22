import { Annotation } from "@/app/utils/types/types";

export const EnlargedViewListing = ({
  data,
  children,
}: {
  data: Annotation[];
  children: React.ReactNode;
}) => {
  return (
    <>
      <hgroup className="mb-4 flex items-end gap-4 border-b border-white/20 pb-4">
        <h3 className="text-3xl ">{children}</h3>
        <span>
          ({data.length} item
          {data.length == 1 ? "" : "s"})
        </span>
      </hgroup>
      <div className="flex gap-8 mb-4">
        <div>
          <h4 className="mb-2">Marks</h4>
          <div className="rounded-lg border border-white/20 overflow-hidden">
            {Object.entries(
              data
                .map((item) => item.marks)
                .flat(Infinity)
                .reduce((acc: Record<string, number>, mark) => {
                  const markStr = mark as string; // Ensure mark is treated as a string
                  acc[markStr] = (acc[markStr] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
            )
              .sort((a, b) => b[1] - a[1])
              .map(([mark, count], index) => (
                <div
                  className={`grid grid-cols-[4fr_1fr] text-white/80 uppercase tracking-wider ${
                    index % 2 === 0 ? "bg-neutral-800" : "bg-neutral-900"
                  }`}
                  key={mark}
                >
                  <span className="p-2 px-4">{mark}</span>
                  <span className="py-2 px-4 flex justify-end border-l border-white/20">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2">Channels</h4>
          <div className="rounded-lg border border-white/20 overflow-hidden">
            {Object.entries(
              data
                .map((item) => item.channels)
                .flat(Infinity)
                .reduce((acc: Record<string, number>, channel) => {
                  const channelStr = channel as string; // Ensure mark is treated as a string
                  acc[channelStr] = (acc[channelStr] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
            )
              .sort((a, b) => b[1] - a[1])
              .map(([channel, count], index) => (
                <div
                  className={`grid grid-cols-[4fr_1fr] text-white/80 uppercase tracking-wider ${
                    index % 2 === 0 ? "bg-neutral-800" : "bg-neutral-900"
                  }`}
                  key={channel}
                >
                  <span className="p-2 px-4">{channel}</span>
                  <span className="py-2 px-4 flex justify-end border-l border-white/20">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
