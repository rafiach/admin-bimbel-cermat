"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3";

function Dropdown({
  query,
  options,
  onPick,
}: {
  query: string;
  options: Option[];
  onPick: (o: Option) => void;
}) {
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-gray-dark">
      {filtered.length === 0 && (
        <li className="px-4 py-2 text-sm text-dark-6">Gak ketemu.</li>
      )}
      {filtered.map((o) => (
        <li key={o.value}>
          <button
            type="button"
            onClick={() => onPick(o)}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-2 dark:hover:bg-dark-2"
          >
            {o.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

/** Buat dipakai di dalam <form action={...}> biasa — hasil pilihan dikirim lewat hidden input `name`. */
export function Combobox({
  name,
  options,
  defaultValue,
  placeholder = "Ketik buat cari...",
  required,
}: {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const defaultOption = options.find((o) => o.value === defaultValue);
  const [query, setQuery] = useState(defaultOption?.label ?? "");
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={selectedValue} required={required} />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedValue("");
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={inputClass}
      />
      {open && (
        <Dropdown
          query={query}
          options={options}
          onPick={(o) => {
            setSelectedValue(o.value);
            setQuery(o.label);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

/** Buat dipakai di komponen client yang state-nya udah dikontrol sendiri (value + onChange), kayak filter di /report. */
export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Ketik buat cari...",
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  const selected = options.find((o) => o.value === value);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  useEffect(() => {
    setQuery(selected?.label ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (e.target.value === "") onChange("");
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={inputClass}
      />
      {open && (
        <Dropdown
          query={query}
          options={options}
          onPick={(o) => {
            onChange(o.value);
            setQuery(o.label);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}