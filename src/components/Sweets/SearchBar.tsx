import { useState } from "react";
import { Search, Filter } from "lucide-react";

interface SearchBarProps {
  onSearch: (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({
      name: name || undefined,
      category: category || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleClear = () => {
    setName("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    onSearch({});
  };

  return (
    <div className="glass-effect rounded-xl p-6 mb-6 card-shadow animate-fadeInUp">
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5 group-hover:text-amber-600 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 ${
            showFilters
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30"
              : "bg-white/50 backdrop-blur text-gray-700 hover:bg-white/70 border border-white/20 hover:shadow-md"
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-t border-white/20 pt-4 animate-slideInDown">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
            >
              <option value="">All Categories</option>
              <option value="Indian Sweet">Indian Sweet</option>
              <option value="Bengali Sweet">Bengali Sweet</option>
              <option value="Cakes">Cakes</option>
              <option value="Pastries">Pastries</option>
              <option value="Cookies">Cookies</option>
              <option value="International Sweet">International Sweet</option>
              <option value="Sugar-free">Sugar-free</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="$0.00"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="$100.00"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 placeholder-gray-400"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/30 transform hover:-translate-y-0.5"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-white/50 hover:bg-white/70 backdrop-blur text-gray-700 font-medium rounded-lg transition-all duration-300 border border-white/20 hover:shadow-md transform hover:-translate-y-0.5"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
