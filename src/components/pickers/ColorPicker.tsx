// src/components/ColorPicker.tsx
"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { useState } from "react";

const PALETTE = [
  "#4583ff",
  "#50c878",
  "#ffb347",
  "#ff6b6b",
  "#c084fc",
  "#8e8e8e",
];

export default function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="h-6 w-6 rounded-full border"
          style={{ background: value }}
        />
      </PopoverTrigger>
      <PopoverContent className="flex gap-2 w-auto">
        {PALETTE.map((c) => (
          <button
            key={c}
            className={`h-6 w-6 rounded-full border ${
              value === c ? "ring-2 ring-primary" : ""
            }`}
            style={{ background: c }}
            onClick={() => {
              onChange(c);
              setOpen(false);
            }}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
