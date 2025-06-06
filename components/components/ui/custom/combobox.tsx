"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../../../lib/utils"
import { Button } from "../button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"

type ComboboxProps<T> = {
  onSearchChange: (value: string) => void
  onSelectOption: (value: T) => void
  options: T[]
  getLabel: (item: T) => string
  getKey: (item: T) => string
}

export function Combobox<T>({
  onSearchChange,
  onSelectOption,
  options,
  getLabel,
  getKey,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [selectedLabel, setSelectedLabel] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selectedLabel || "Search..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Type to search..."
            className="h-9"
            onValueChange={(val) => {
              setInputValue(val)
              onSearchChange(val)
            }}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => {
                const label = getLabel(item)
                return (
                  <CommandItem
                    key={getKey(item)}
                    value={label}
                    onSelect={() => {
                      setSelectedLabel(label)
                      onSelectOption(item)
                      setOpen(false)
                    }}
                  >
                    {label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedLabel === label ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
