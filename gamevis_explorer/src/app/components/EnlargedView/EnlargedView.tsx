import { Annotation, VisUsage } from "../../types/types";
import { useFilterContext } from "../Nav/FilterNav";

export const EnlargedView = ({ data }: { data: Annotation[] }) => {
  const { filters, setFilters } = useFilterContext();
  return (
    <div className="fixed inset-0 bg-background/95 p-16 overflow-auto z-100">
      <div className="relative">
        <section className="sticky top-0 -mx-3 pl-6 p-2 bg-neutral-900 z-10 rounded-lg mb-8 flex gap-8 items-stretch">
          <hgroup>
            <h2 className="text-lg">
              {filters.position[0]} {filters.position[1]}
            </h2>
            <p>{data.length} annotations</p>
          </hgroup>
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
          <button
            className="ml-auto p-4 py-2 rounded-md bg-neutral-700 cursor-pointer"
            onClick={() => {
              setFilters({ ...filters, position: ["", ""], usages: [] });
            }}
          >
            Close
          </button>
        </section>
        {[
          ...new Set(
            data.flatMap((item) =>
              item.tags ? item.tags.map((tag) => tag) : "N/A"
            )
          ),
        ].map((tag) => (
          <div key={`tag-group-${tag}`} className="mb-12">
            <h3 className="text-xl border-t border-neutral-500">{tag}</h3>
            <ul className="flex flex-wrap gap-4 ">
              {data
                .filter((item) => item.tags?.includes(tag))
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
                              ? item.channels[i].map((item) => item).join(", ")
                              : "N/A"}
                          </span>
                          <span className="text-sm opacity-50">
                            T:{" "}
                            {item.tags
                              ? item.tags.map((item) => item).join(", ")
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
      </div>
    </div>
  );
};
