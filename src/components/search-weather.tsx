import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MouseEvent, useRef, useState } from "react";
import { useCitySuggestions } from "@/hooks/use-city-suggestion";
import { Card } from "./ui/card";
import { SearchCityResponse } from "@/app/api/search-city/route";

export function SearchWeather({
  handleSelect,
}: {
  handleSelect: (v: SearchCityResponse) => void;
}) {
  const [search, setSearch] = useState("");
  const { results: searchResults } = useCitySuggestions(search);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocusInput = () => {
    setTimeout(() => inputRef.current?.focus(), 100);
    setIsFocused(true);
  };
  return (
    <div
      className={`fixed size-full inset-0 flex flex-col p-2 transition-all ${
        isFocused
          ? "backdrop-blur-md  bg-black/20"
          : "pointer-events-none bg-black/0"
      }`}
      onClick={(e) => {
        if (e.currentTarget === e.target) setIsFocused(false);
      }}
    >
      {/* search input */}
      <Input
        type="search"
        ref={inputRef}
        className={`invisible ${
          isFocused
            ? "pointer-events-auto opacity-100 animate-in fade-in slide-in-from-top visible"
            : "opacity-0"
        } bg-white/50 transition-all`}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* search suggestion */}
      <div
        className={`flex flex-col gap-1 p-2 max-h-[80%] overflow-y-auto transition-all invisible ${
          isFocused ? "opacity-100 visible" : "opacity-0"
        }`}
      >
        {search.length
          ? searchResults.map((i, index) => (
              <Card
                key={`card-suggestion-${index}`}
                className="!shadow-none flex-row !rounded-full max-h-[2.5rem] p-0 px-2 items-center xl:cursor-pointer xl:hover:!bg-white/20"
                onClick={() => {
                  handleSelect(i);
                  setIsFocused(false);
                }}
              >
                <h1 className="font-medium text-[1.3rem] line-clamp-1">
                  {i.name}
                </h1>
                <span className="ml-auto">{i.country}</span>
              </Card>
            ))
          : null}
      </div>

      {/* search button */}
      <Button
        size="icon"
        className={`!glass-morphism !rounded-full size-[3rem] xl:min-w-[3rem] xl:w-fit xl:p-2 pointer-events-auto mt-auto ml-auto ${
          isFocused
            ? "animate-out fade-out slide-out-to-right duration-300 invisible"
            : "animate-in fade-in slide-in-from-right duration-300 visible"
        }`}
        onClick={handleFocusInput}
      >
        <Search className="size-[1.5rem]" />
        <span className="hidden xl:block">Search Location</span>
      </Button>
    </div>
  );
}
