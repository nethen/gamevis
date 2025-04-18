"use client";
import { getTags } from "@/app/utils/methods/methods";
import { Annotation, VisUsage } from "../../utils/types/types";
import { useFilterContext } from "../Nav/FilterNav";
import { useState } from "react";

export const EnlargedView = ({ data }: { data: Annotation[] }) => {
  const { filters, setFilters } = useFilterContext();
  const tags = getTags(data);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-background/95 p-16 overflow-auto z-100">
      <div className="relative bg-neutral-900 p-8 flex flex-col h-full rounded-lg">
        <header className="flex justify-between mb-4">
          <h2 className="text-lg font-medium">
            {filters.position[0]} {filters.position[1]}
          </h2>
          <form
            className="flex gap-4"
            onChange={(e) => {
              const formData = new FormData(e.currentTarget);
              const selectedStates = Array.from(formData.entries()).map(
                ([name, value]) => value.toString()
              );
              setFilters({ ...filters, usages: selectedStates });
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
                    data.filter((subitem) =>
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
          <div className="flex gap-4">
            <div className="text-sm font-semibold text-right">
              <span className="text-foreground/50">Listing</span> <br />
              <span>
                {data.length} snapshot
                {data.length == 1 ? "" : "s"}
              </span>
            </div>
            <button
              className="px-3 leading-0 rounded-full bg-neutral-500 font-bold text-sm cursor-pointer"
              onClick={() => {
                setFilters({
                  ...filters,
                  position: ["", ""],
                });
              }}
            >
              Close
            </button>
          </div>
        </header>

        <div className="flex gap-8 overflow-hidden">
          <section className="w-[20rem] overflow-scroll pr-6">
            <h3 className="mb-2 text-foreground/50">Tags</h3>
            <ul className="flex flex-col gap-4">
              {tags.map((tagGroup, i) => (
                <li
                  key={`tag-${i}`}
                  className={`flex px-2 py-1 rounded-sm cursor-pointer ${
                    selectedTag == tagGroup[0] ? "bg-neutral-700 px-2" : ""
                  }`}
                  onClick={() => {
                    setSelectedTag(
                      selectedTag == tagGroup[0] ? null : tagGroup[0]
                    );
                  }}
                >
                  {tagGroup[0]}{" "}
                  <span className="ml-auto text-foreground/50">
                    {tagGroup[1]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="overflow-auto w-full">
            {selectedTag == null && (
              <div className="flex gap-8 mb-4">
                <div>
                  <h4 className="mb-2">Marks</h4>
                  {Object.entries(
                    data
                      // .filter((item) => item.tags?.includes(tagGroup[0]))
                      .map((item) => item.marks)
                      .flat(Infinity)
                      .reduce((acc: Record<string, number>, mark) => {
                        const markStr = mark as string; // Ensure mark is treated as a string
                        acc[markStr] = (acc[markStr] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([mark, count]) => (
                      <div key={mark}>
                        {mark}: {count}
                      </div>
                    ))}
                </div>
                <div>
                  <h4 className="mb-2">Channels</h4>
                  {Object.entries(
                    data
                      // .filter((item) => item.tags?.includes(tagGroup[0]))
                      .map((item) => item.channels)
                      .flat(Infinity)
                      .reduce((acc: Record<string, number>, channel) => {
                        const channelStr = channel as string; // Ensure mark is treated as a string
                        acc[channelStr] = (acc[channelStr] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([channel, count]) => (
                      <div key={channel}>
                        {channel}: {count}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {tags
              .filter((item) => selectedTag == null || item[0] == selectedTag)
              .map((tagGroup) => (
                <div key={`tag-group-${tagGroup[0]}`} className="mb-12">
                  <h3 className="text-xl border-neutral-500 mb-2">
                    {tagGroup[0]}
                  </h3>
                  <div className="flex gap-8 mb-4">
                    <div>
                      <h4 className="mb-2">Marks</h4>
                      {Object.entries(
                        data
                          .filter((item) => item.tags?.includes(tagGroup[0]))
                          .map((item) => item.marks)
                          .flat(Infinity)
                          .reduce((acc: Record<string, number>, mark) => {
                            const markStr = mark as string; // Ensure mark is treated as a string
                            acc[markStr] = (acc[markStr] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .map(([mark, count]) => (
                          <div key={mark}>
                            {mark}: {count}
                          </div>
                        ))}
                    </div>
                    <div>
                      <h4 className="mb-2">Channels</h4>
                      {Object.entries(
                        data
                          .filter((item) => item.tags?.includes(tagGroup[0]))
                          .map((item) => item.channels)
                          .flat(Infinity)
                          .reduce((acc: Record<string, number>, channel) => {
                            const channelStr = channel as string; // Ensure mark is treated as a string
                            acc[channelStr] = (acc[channelStr] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .map(([channel, count]) => (
                          <div key={channel}>
                            {channel}: {count}
                          </div>
                        ))}
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-4 ">
                    {data
                      .filter((item) => item.tags?.includes(tagGroup[0]))
                      .map((item, i) => (
                        <li
                          key={"modal-item-" + i}
                          className={`${
                            filters.usages.length == 0 ||
                            item.vis_usage.some((usage) =>
                              filters.usages.includes(usage)
                            )
                              ? "-order-1 opacity-100"
                              : "opacity-10"
                          }`}
                        >
                          <hgroup
                            className={`${
                              filters.usages.length == 0 ||
                              item.vis_usage.some((usage) =>
                                filters.usages.includes(usage)
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
                                    className={`px-2 bg-neutral-800 rounded-full leading-none flex`}
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
                            className={`
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
                              <li key={i} className={`flex flex-col`}>
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
                                  M:{" "}
                                  {Array.isArray(item.marks[i])
                                    ? item.marks[i]
                                        .map((item) => item)
                                        .join(", ")
                                    : "N/A"}
                                </span>
                                <span className="text-sm opacity-50">
                                  C:{" "}
                                  {Array.isArray(item.channels[i])
                                    ? item.channels[i]
                                        .map((item) => item)
                                        .join(", ")
                                    : "N/A"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </section>
        </div>
      </div>
    </div>
  );
};
