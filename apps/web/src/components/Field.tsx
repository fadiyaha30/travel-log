type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
};

export function Field({ id, label, value, onChange, type = "text", error, hint, autoComplete }: Props) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-12 rounded-xl border bg-white px-3.5 text-[15px] outline-none focus:ring-2 focus:ring-[#1E58C9] ${
          error ? "border-[#A3261B]" : "border-[#C9CEC8]"
        }`}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-[#55606B]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[#A3261B]">
          {error}
        </p>
      )}
    </div>
  );
}
