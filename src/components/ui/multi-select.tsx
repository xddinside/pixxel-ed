"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type MultiSelectOption = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  max?: number
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
  max,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item))
  }

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      handleUnselect(selectedValue);
    } else {
      if (max && value.length >= max) {
        toast.error(`You can select a maximum of ${max} subjects.`);
        return;
      }
      onChange([...value, selectedValue]);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", value.length > 0 ? "h-full" : "h-10")}
        >
          <div className="flex flex-wrap items-center gap-1">
            {value.length > 0 ? (
              options
                .filter((option) => value.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(option.value);
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-4 w-4 cursor-pointer" />
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command className={className}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  onClick={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
