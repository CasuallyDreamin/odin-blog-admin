"use client";

import { useEffect, useState, useCallback } from "react";

export interface OptionItem {
  id: string;
  name: string;
}

interface MultiSelectFieldProps {
  label: string;
  fetchOptions: (params: { search?: string; limit?: number }) => Promise<{ data: any[] }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectField({
  label,
  fetchOptions,
  selectedIds,
  onChange,
  placeholder = "Select...",
}: MultiSelectFieldProps) {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadOptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchOptions({ search: searchTerm, limit: 100 });
      const items = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setOptions(items);
    } catch (err) {
      console.error("Failed to fetch options", err);
    } finally {
      setLoading(false);
    }
  }, [fetchOptions, searchTerm]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleSelect = (id: string) => {
    if (id && !selectedIds.includes(id)) {
      onChange([...selectedIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((i) => i !== id));
  };

  return (
    <div className="mb-4 flex flex-col">
      <label className="mb-1 font-semibold text-cyan-300">{label}</label>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          
          
          <select
            className="p-2 border border-gray-700 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value=""
            onChange={(e) => handleSelect(e.target.value)}
            disabled={loading}
          >
            <option value="">{loading ? "Loading..." : placeholder}</option>
            {options
              .filter((o) => !selectedIds.includes(o.id))
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {selectedIds.map((id) => {
            const item = options.find((o) => o.id === id);
            return (
              <span
                key={id}
                className="flex items-center gap-1 px-3 py-1 bg-cyan-700 text-white rounded-full text-sm cursor-pointer hover:bg-cyan-600 transition-colors"
                onClick={() => handleRemove(id)}
              >
                {item?.name || id} 
                <span className="font-bold ml-1">×</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}