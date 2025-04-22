"use client";
import { getTags } from "@/app/utils/methods/methods";
import { Annotation, VisUsage } from "../../utils/types/types";
import { useFilterContext } from "../Nav/FilterNav/FilterNav";
import { Dispatch } from "react";

export const EnlargedView = ({
  data,
  handler,
}: {
  data: Annotation[];
  handler: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { filters, setFilters } = useFilterContext();
  const tags = getTags(data);

  return (
    <div className="fixed inset-0 bg-background/95 p-16 overflow-auto z-100">
      <div className="relative bg-neutral-900 p-8 flex flex-col h-full rounded-lg">
        <header className="flex justify-between mb-4">
          <h2 className="text-lg font-medium">
            {filters.position.length > 0
              ? filters.position.map((item) => item.y + " " + item.x).join(", ")
              : "All data"}
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
                className={`flex gap-2 items-center ${
                  data.filter((subitem) =>
                    subitem.vis_usage.includes(item as VisUsage)
                  ).length > 0
                    ? "cursor-pointer"
                    : "hidden"
                }`}
              >
                <input
                  type="checkbox"
                  name={`state-${i}`}
                  id={`state-${i}`}
                  value={item}
                />
                <label
                  htmlFor={`state-${i}`}
                  className={`${
                    data.filter((subitem) =>
                      subitem.vis_usage.includes(item as VisUsage)
                    ).length > 0
                      ? "cursor-pointer"
                      : "opacity-10 cursor-not-allowed"
                  }`}
                >
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
              className="size-10 flex items-center justify-center leading-0 rounded-full bg-neutral-500 font-bold text-sm cursor-pointer"
              onClick={() => {
                setFilters({ ...filters, tags: [] });
                handler(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex gap-8 overflow-hidden">
          <section className="w-[20rem] overflow-scroll pr-6">
            <h3 className="mb-2 text-foreground/50">Tags</h3>
            {filters.tags.length > -1 && (
              <div className="sticky top-0 bg-neutral-900 border border-white/5 rounded-md p-2 mb-4">
                <div className="flex flex-wrap gap-2 mb-4 content-start bg-neutral-800 rounded-md min-h-[2rem] p-2 ">
                  {filters.tags.map((tag) => (
                    <div
                      onClick={() => {
                        setFilters({
                          ...filters,
                          tags: filters.tags.filter((item) => item != tag),
                        });
                      }}
                      key={tag}
                      className="bg-neutral-700 text-sm px-3 py-1 rounded-full h-fit flex items-center gap-2 hover:bg-neutral-500 duration-100 cursor-pointer"
                    >
                      <span>{tag}</span>
                      <button
                        className="text-foreground/50 hover:text-foreground cursor-pointer"
                        onClick={() => {
                          setFilters({
                            ...filters,
                            tags: filters.tags.filter((item) => item != tag),
                          });
                        }}
                        key={tag}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="text-sm underline cursor-pointer text-foreground/60 hover:text-foreground"
                  onClick={() => setFilters({ ...filters, tags: [] })}
                >
                  Clear selected tags
                </button>
              </div>
            )}

            <ul className="flex flex-col gap-4">
              {tags.map((tagGroup, i) => (
                <li
                  key={`tag-${i}`}
                  className={`flex px-2 py-1 rounded-sm cursor-pointer ${
                    filters.tags.includes(tagGroup[0])
                      ? "bg-neutral-700 px-2"
                      : ""
                  }`}
                  onClick={() => {
                    setFilters({
                      ...filters,
                      tags: filters.tags.includes(tagGroup[0])
                        ? filters.tags.filter((item) => item != tagGroup[0])
                        : [...filters.tags, tagGroup[0]],
                      usages: [],
                    });
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
            {filters.tags.length === 0 && (
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
            {filters.tags.length === 0 ? (
              tags.map((tagGroup) => (
                <div key={`tag-group-${tagGroup[0]}`} className="mb-12">
                  <hgroup className="mb-4 flex items-end gap-4 border-b border-white/20 pb-4">
                    <h3 className="text-3xl ">
                      {tagGroup[0]}
                    </h3>
                    <span>(
                      {
                        data.filter((item) => item.tags?.includes(tagGroup[0]))
                          .length
                      }{" "}
                      item
                      {data.filter(
                        (item) => item.tags && item.tags?.includes(tagGroup[0])
                      ).length == 1
                        ? ""
                        : "s"})
                    </span>
                  </hgroup>
                  <div className="flex gap-8 mb-4">
                    <div>
                      <h4 className="mb-2">Marks</h4>
                      <div className="rounded-lg border border-white/20 overflow-hidden">
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
                        .map(([mark, count], index) => (
                          <div
                          className={`grid grid-cols-[4fr_1fr] text-white/80 uppercase tracking-wider ${index % 2 === 0 ? "bg-neutral-800" : "bg-neutral-900"}`}
                          key={mark}
                        >
                          <span className="p-2 px-4">{mark}</span>
                          <span className="py-2 px-4 flex justify-end border-l border-white/20">{count}</span>
                        </div>
                        ))}
                        </div>
                    </div>
                    <div>
                      <h4 className="mb-2">Channels</h4>
                      <div className="rounded-lg border border-white/20 overflow-hidden">
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
                        .map(([channel, count],index) => (
                          <div
                          className={`grid grid-cols-[4fr_1fr] text-white/80 uppercase tracking-wider ${index % 2 === 0 ? "bg-neutral-800" : "bg-neutral-900"}`}
                          key={channel}
                        >
                          <span className="p-2 px-4">{channel}</span>
                          <span className="py-2 px-4 flex justify-end border-l border-white/20">{count}</span>
                        </div>
                        ))}
                        </div>
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
              ))
            ) : (
              <div key={`tag-group-filtered`} className="mb-12">
                <hgroup className="mb-4">
                  <h3 className="text-xl border-neutral-500">
                    {filters.tags.map((tag) => tag).join(", ")}
                  </h3>
                  <span>
                    {
                      data.filter(
                        (item) =>
                          item.tags &&
                          item.tags.some((tag) => filters.tags.includes(tag))
                      ).length
                    }{" "}
                    item
                    {data.filter(
                      (item) =>
                        item.tags &&
                        item.tags.some((tag) => filters.tags.includes(tag))
                    ).length == 1
                      ? ""
                      : "s"}
                  </span>
                </hgroup>
                <div className="flex gap-8 mb-4">
                  <div>
                    <h4 className="mb-2">Marks</h4>
                    {Object.entries(
                      data
                        .filter(
                          (item) =>
                            item.tags &&
                            item.tags.some((tag) => filters.tags.includes(tag))
                        )
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
                        .filter(
                          (item) =>
                            item.tags &&
                            item.tags.some((tag) => filters.tags.includes(tag))
                        )
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
                    .filter(
                      (item) =>
                        item.tags &&
                        item.tags.some((tag) => filters.tags.includes(tag))
                    )
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
                                  ? item.marks[i].map((item) => item).join(", ")
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
