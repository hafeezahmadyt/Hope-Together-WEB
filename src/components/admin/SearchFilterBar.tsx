import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  totalResults?: number;
  itemLabel?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search records...',
  filterOptions,
  selectedFilter,
  filterValue,
  onFilterChange,
  totalResults,
  itemLabel = 'records',
}) => {
  const activeFilter = selectedFilter ?? filterValue;
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        {filterOptions && filterOptions.length > 0 && onFilterChange && (
          <div className="flex items-center gap-2">
            <div className="relative inline-block w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={activeFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full sm:w-auto pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1D70B8] appearance-none cursor-pointer shadow-2xs"
              >
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {totalResults !== undefined && (
        <span className="text-xs text-slate-500 font-mono self-end sm:self-auto">
          {totalResults} {itemLabel}
        </span>
      )}
    </div>
  );
};
