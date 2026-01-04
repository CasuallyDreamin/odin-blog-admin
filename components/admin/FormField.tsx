'use client';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'textarea' | 'number' | 'password' | 'select' | 'url';
  value: string | number;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
  options?: string[];
}

export default function FormField({
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  required = false,
  options = [],
}: FormFieldProps) {
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={fieldId} className="mb-1 font-semibold">
        {label}{required && '*'}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : type === 'select' ? (
        <select
          id={fieldId}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" className="text-black">Select...</option>
          {options.map((opt) => (
            <option className="text-black" key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}