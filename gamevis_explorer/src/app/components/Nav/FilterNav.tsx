"use client";
import { createContext, useContext, useState } from "react";
import meta from "@/app/meta.json";

const uniqueGenres = [...new Set(meta.map((item) => item.genre))];

export const FilterNav = () => {
  const [isOpen, setIsOpen] = useState("");
  return (
    <nav className="py-2 col-span-full flex gap-4 relative bg-red-500 h-10">
      {[
        {
          name: "Coords",
          options: ["Camera", "World"],
        },
        {
          name: "Relativity",
          options: ["Screen", "Relative"],
        },
        {
          name: "Genres",
          options: uniqueGenres,
        },
      ].map((title) => (
        <FilterGroup
          title={title.name}
          key={title.name}
          isOpen={isOpen === title.name}
          opener={() => setIsOpen(isOpen === title.name ? "" : title.name)}
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-2 max-w-80">
            {title.options.map((item) => (
              <li
                key={item}

                // className="bg-slate-200 w-20 h-8 flex items-center justify-center"
              >
                <input
                  type="checkbox"
                  id={`nav_filter__check-${title.name}-${item}`}
                  name={`nav_filter__check-${title.name}-${item}`}
                  className="bg-neutral-700 pl-2 rounded-sm"
                />
                <label htmlFor={`nav_filter__check-${title.name}-${item}`}>
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </FilterGroup>
      ))}
      <div className="ml-auto flex gap-4 mr-4">
        <div className="flex gap-2">
          <label htmlFor="minSpeed">Min</label>
          <input
            id="minSpeed"
            name="minSpeed"
            type="number"
            min={4}
            max={12}
            defaultValue={4}
            className="bg-neutral-700 pl-2 rounded-sm"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="maxSpeed">Max</label>
          <input
            id="maxSpeed"
            name="maxpeed"
            type="number"
            min={4}
            max={12}
            defaultValue={12}
            className="bg-neutral-700 pl-2 rounded-sm"
          />
        </div>
      </div>
    </nav>
  );
};

const FilterGroup = ({
  title,
  children,
  isOpen,
  opener,
}: {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  opener: () => void;
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <div className="flex px-2 cursor-pointer" onClick={() => opener()}>
        <h2>{title}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-5 ${isOpen ? "rotate-180" : ""} ml-auto`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="w-fit absolute top-10 p-2 bg-neutral-900">
          {children}
        </div>
      )}
    </div>
  );
};

type FilterState = {
  coords: string;
  relative: string;
  game: string;
  genre: string;

  position: string[];
  usages: string[];
  speed: number[];
};

const FilterContext = createContext<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
} | null>(null);

export const FilterContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filters, setFilters] = useState<FilterState>({
    coords: "Camera",
    relative: "Screen",
    game: "",
    genre: "",
    position: ["", ""],
    usages: [] as string[],
    speed: [4, 12],
  });

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
