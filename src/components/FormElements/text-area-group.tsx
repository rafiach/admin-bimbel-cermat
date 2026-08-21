import { cn } from "@/lib/utils";
import { useId } from "react";

type TextareaGroupProps = {
  className?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
  rows?: number;
  defaultValue?: string;
};

export function TextareaGroup({
  className,
  label,
  placeholder,
  required,
  name,
  rows = 3,
  defaultValue,
}: TextareaGroupProps) {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required && <span className="ml-1 select-none text-red">*</span>}
      </label>

      <div className="relative mt-3">
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          rows={rows}
          defaultValue={defaultValue}
          required={required}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark",
          )}
        />
      </div>
    </div>
  );
}