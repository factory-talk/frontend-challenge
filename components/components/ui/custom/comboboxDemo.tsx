"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

// import { cn } from "@/lib/utils"
import { cn } from "../../../lib/utils";

import { Button } from "@/components/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/components/ui/popover";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const selectedLabel =
    frameworks.find((f) => f.value === value)?.label ?? "Select framework...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search framework..."
            className="h-9 px-3 text-sm"
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => {
                const isSelected = value === framework.value;
                return (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => {
                      setValue(framework.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-sm",
                      "hover:bg-accent hover:text-accent-foreground",
                      value === framework.value
                        ? "bg-accent text-accent-foreground"
                        : ""
                    )}
                  >
                    <span>{framework.label}</span>
                    {isSelected && (
                      <Check className="ml-auto h-4 w-4 opacity-100 text-primary" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
