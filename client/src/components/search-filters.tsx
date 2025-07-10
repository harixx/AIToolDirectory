import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: {
    pricingModel?: string;
    difficultyLevel?: string;
    rating?: string;
    sortBy?: string;
  }) => void;
  initialFilters?: {
    search?: string;
    pricingModel?: string;
    difficultyLevel?: string;
    rating?: string;
    sortBy?: string;
  };
}

export default function SearchFilters({ onSearch, onFilter, initialFilters = {} }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [pricingModel, setPricingModel] = useState(initialFilters.pricingModel || "");
  const [difficultyLevel, setDifficultyLevel] = useState(initialFilters.difficultyLevel || "");
  const [rating, setRating] = useState(initialFilters.rating || "");
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "popularity");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { pricingModel, difficultyLevel, rating, sortBy };
    newFilters[key as keyof typeof newFilters] = value;
    
    switch (key) {
      case 'pricingModel':
        setPricingModel(value);
        break;
      case 'difficultyLevel':
        setDifficultyLevel(value);
        break;
      case 'rating':
        setRating(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
    }
    
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setPricingModel("");
    setDifficultyLevel("");
    setRating("");
    setSortBy("popularity");
    onFilter({
      pricingModel: "",
      difficultyLevel: "",
      rating: "",
      sortBy: "popularity"
    });
  };

  const activeFiltersCount = [pricingModel, difficultyLevel, rating].filter(Boolean).length;

  return (
    <div className="bg-white border-b py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <Select
              value={pricingModel}
              onValueChange={(value) => handleFilterChange('pricingModel', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Pricing Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Pricing</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Freemium">Freemium</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={difficultyLevel}
              onValueChange={(value) => handleFilterChange('difficultyLevel', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={rating}
              onValueChange={(value) => handleFilterChange('rating', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              Active filters:
            </span>
            {pricingModel && (
              <Badge variant="outline" className="flex items-center gap-1">
                Pricing: {pricingModel}
                <button
                  onClick={() => handleFilterChange('pricingModel', "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {difficultyLevel && (
              <Badge variant="outline" className="flex items-center gap-1">
                Difficulty: {difficultyLevel}
                <button
                  onClick={() => handleFilterChange('difficultyLevel', "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {rating && (
              <Badge variant="outline" className="flex items-center gap-1">
                Rating: {rating}+ Stars
                <button
                  onClick={() => handleFilterChange('rating', "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
