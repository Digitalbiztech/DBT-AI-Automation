import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background/50 border-border/50 text-xs h-10 rounded-xl hover:border-primary/50 transition-colors px-3",
            className
          )}
        >
          <div className="flex gap-1 overflow-hidden">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {selected.map((item) => (
                  <Badge
                    variant="secondary"
                    key={item}
                    className="rounded-md px-1 font-normal text-[10px] whitespace-nowrap bg-primary/10 text-primary border-primary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    {item}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                    >
                      <X className="h-2 w-2 text-primary" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-xl border-border/40 shadow-2xl" align="start">
        <Command className="rounded-xl">
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9 text-xs" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandItem
                onSelect={() => {
                  onChange([]);
                  setOpen(false);
                }}
                className="text-xs"
              >
                <div className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selected.length === 0 ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                )}>
                  <Check className={cn("h-4 w-4")} />
                </div>
                <span>All Items</span>
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => handleSelect(option)}
                  className="text-xs"
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selected.includes(option) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                  )}>
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span>{option}</span>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
