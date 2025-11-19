'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import useSearchBar from '@/hooks/useSearchBar';
import '@/styles/admin/FilterBar.tailwind.css';
import { Category } from '@/types/category';

type DropdownItem = string | { id: string; name: string };

interface FilterBarProps {
  categories?: Category[];
  tags?: string[];
  statuses?: string[];
  selectedCategories?: string[];
  selectedTags?: string[];
  selectedStatuses?: string[];
  onCategoryChange?: (selected: string[]) => void;
  onTagChange?: (selected: string[]) => void;
  onStatusChange?: (selected: string[]) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function FilterBar({
  categories = [],
  tags = [],
  statuses = [],
  selectedCategories = [],
  selectedTags = [],
  selectedStatuses = [],
  onCategoryChange = () => {},
  onTagChange = () => {},
  onStatusChange = () => {},
  searchTerm = '',
  onSearchChange = () => {},
  placeholder = 'Search titles, tags, categories...',
  debounceMs = 200,
}: FilterBarProps) {
  const [openMenu, setOpenMenu] = useState<'categories' | 'tags' | 'statuses' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { search, handleChange } = useSearchBar({
    initialValue: searchTerm,
    debounceMs,
    onSearchChange,
  });

  const toggleItem = useCallback(
    (item: string, selected: string[], onChange: (next: string[]) => void) => {
      const next = selected.includes(item)
        ? selected.filter((x) => x !== item)
        : [...selected, item];
      onChange(next);
    },
    []
  );

  type DropdownProps = {
    type: 'categories' | 'tags' | 'statuses';
    label: string;
    items: DropdownItem[];
    selected: string[];
    onToggle: (item: string) => void;
  };

  const Dropdown = ({ type, label, items, selected, onToggle }: DropdownProps) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const selectedCount = selected.length;
    const shownLabel = selectedCount > 0 ? `${label} (${selectedCount})` : label;

    if (!items.length) return null;

    return (
      <div className="relative filter-dropdown">
        <button
          ref={btnRef}
          className={`dropdown-btn ${openMenu === type ? 'active' : ''}`}
          onClick={() => setOpenMenu(openMenu === type ? null : type)}
          aria-expanded={openMenu === type}
          aria-haspopup="menu"
          type="button"
        >
          <span className="dropdown-label">{shownLabel}</span>
          <motion.div
            animate={{ rotate: openMenu === type ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center"
          >
            <ChevronDown className="w-4 h-4 ml-2" />
          </motion.div>
        </button>

        <AnimatePresence>
          {openMenu === type && (
            <motion.div
              className="dropdown-menu"
              key={type}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              role="menu"
            >
              {items.map((item) => {
                const value = typeof item === 'string' ? item : item.name;
                return (
                  <label className="dropdown-item" key={value}>
                    <input
                      type="checkbox"
                      checked={selected.includes(value)}
                      onChange={() => onToggle(value)}
                    />
                    <span className="dropdown-item-text">{value}</span>
                  </label>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="filter-bar" ref={containerRef}>
      <input
        type="search"
        placeholder={placeholder}
        value={search}
        onChange={handleChange}
        className="filter-search-input"
        aria-label="Search content"
      />

      <div className="filter-controls">
        <Dropdown
          type="categories"
          label="Categories"
          items={categories}
          selected={selectedCategories}
          onToggle={(item) => toggleItem(item, selectedCategories, onCategoryChange)}
        />
        <Dropdown
          type="tags"
          label="Tags"
          items={tags}
          selected={selectedTags}
          onToggle={(item) => toggleItem(item, selectedTags, onTagChange)}
        />
        <Dropdown
          type="statuses"
          label="Status"
          items={statuses}
          selected={selectedStatuses}
          onToggle={(item) => toggleItem(item, selectedStatuses, onStatusChange)}
        />
      </div>
    </div>
  );
}
