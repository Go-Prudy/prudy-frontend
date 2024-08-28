interface FormFieldProps {
  label: string;
  labelFor: string;
  direction?: 'row' | 'column';
  children: React.ReactNode;
}

export default function FormField({
  labelFor,
  label,
  children,
  direction = 'column',
}: FormFieldProps) {
  const flexClass = direction === 'column' ? 'flex-col justify-center' : 'items-center';

  return (
    <div
      className={`form-field px-4 flex ${flexClass} gap-2 bg-graySubtle border border-grayDefault rounded-[20px] h-[72px]`}
    >
      <label htmlFor={labelFor} className="text-xs text-grayCaption leading-1.2">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}
