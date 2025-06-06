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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover"


export function Combobox({ onSearchChange }: { onSearchChange: (value: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || "Search city..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Type city..."
            className="h-9"
            onValueChange={(val) => {
              setValue(val)
              onSearchChange(val) 
            }}
          />
          <CommandList>
            <CommandEmpty>No result</CommandEmpty>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

