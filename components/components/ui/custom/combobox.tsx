"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "../../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

import { Button } from "../button";

type ComboboxProps<T> = {
  onSearchChange: (value: string) => void;
  onSelectOption: (value: T) => void;
  options: T[];
  getLabel: (item: T) => string;
  getKey: (item: T) => string;
};

export function Combobox<T>({
  onSearchChange,
  onSelectOption,
  options,
  getLabel,
  getKey,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedLabel, setSelectedLabel] = React.useState("");

  return (
    <>
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />,
          document.body
        )}
      <div className="w-full sm:w-[300px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className=" w-full sm:w-[300px] justify-between  font-medium shadow-sm bg-background border border-input hover:bg-accent hover:text-accent-foreground transition"
            >
              {selectedLabel || "Search..."}
              <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent 
            style={{
              width: "400px",
              height: "400px",
              fontSize: "20px",
            }}
          
          className=" w-full text-xl p-0 rounded-md shadow-lg border">
            <Command>
              <CommandInput

                placeholder="Type to search..."
                className="h-9 text-xl"
                onValueChange={(val) => {
                  setInputValue(val);
                  onSearchChange(val);
                }}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((item) => {
                    const label = getLabel(item);
                    return (
                      <CommandItem
                        key={getKey(item)}
                        value={label}
                       className={cn(
  "relative flex cursor-pointer items-center px-3 py-2 text-xl transition",
  "hover:bg-gray-100 dark:hover:bg-gray-700",
  "hover:text-black dark:hover:text-white",
  "data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
)}

                        onSelect={() => {
                          setSelectedLabel(label);
                          onSelectOption(item);
                          setOpen(false);
                        }}
                      >
                        {label}
                        <Check
                          className={cn(
                            "ml-auto size-4 shrink-0 pointer-events-none",
                            selectedLabel === label
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
