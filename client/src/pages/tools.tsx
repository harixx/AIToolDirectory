import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import ToolCard from "@/components/tool-card";
import SearchFilters from "@/components/search-filters";
import CategoryFilter from "@/components/category-filter";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Tools() {
  const [location, navigate] = useLocation();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    pricingModel: "",
    difficultyLevel: "",
    rating: "",
    sortBy: "popularity",
  });

  const categorySlug = params.slug;
  const itemsPerPage = 20;

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const searchParam = urlParams.get('search') || '';
    const pricingParam = urlParams.get('pricingModel') || '';
    const difficultyParam = urlParams.get('difficultyLevel') || '';
    const ratingParam = urlParams.get('rating') || '';
    const sortParam = urlParams.get('sortBy') || 'popularity';
    
    setFilters({
      search: searchParam,
      pricingModel: pricingParam,
      difficultyLevel: difficultyParam,
      rating: ratingParam,
      sortBy: sortParam,
    });
  }, [location]);

  const { data: toolsData, isLoading, isError, error } = useQuery({
    queryKey: [
      "/api/tools",
      categorySlug || "",
      filters.search || "",
      filters.pricingModel || "",
      filters.difficultyLevel || "",
      filters.rating || "",
      filters.sortBy || "popularity",
      itemsPerPage,
      (currentPage - 1) * itemsPerPage,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categorySlug) params.set('category', categorySlug);
      if (filters.search) params.set('search', filters.search);
      if (filters.pricingModel) params.set('pricingModel', filters.pricingModel);
      if (filters.difficultyLevel) params.set('difficultyLevel', filters.difficultyLevel);
      if (filters.rating) params.set('rating', filters.rating);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      params.set('limit', itemsPerPage.toString());
      params.set('offset', ((currentPage - 1) * itemsPerPage).toString());
      
      const response = await fetch(`/api/tools?${params.toString()}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
    updateURL({ ...filters, search: query });
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters);
  };

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'popularity') {
        params.set(key, value);
      }
    });
    
    const queryString = params.toString();
    const basePath = categorySlug ? `/categories/${categorySlug}` : '/tools';
    navigate(`${basePath}${queryString ? `?${queryString}` : ''}`);
  };

  const handleCompare = (toolId: number) => {
    // For now, just navigate to compare page
    navigate(`/compare?tools=${toolId}`);
  };

  const totalPages = Math.ceil((toolsData?.total || 0) / itemsPerPage);

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CategoryFilter selectedCategory={categorySlug} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load tools. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CategoryFilter selectedCategory={categorySlug} />
      
      <SearchFilters
        onSearch={handleSearch}
        onFilter={handleFilter}
        initialFilters={filters}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {categorySlug ? (
              <>
                {categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </>
            ) : (
              "All AI Tools"
            )}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {isLoading ? (
                "Loading..."
              ) : (
                `${toolsData?.total || 0} tools found`
              )}
            </p>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3" />
                  <div className="flex-1">
                    <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                    <div className="w-16 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="w-full h-16 bg-gray-200 rounded mb-4" />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-gray-200 rounded-full" />
                    <div className="w-16 h-6 bg-gray-200 rounded-full" />
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : toolsData?.tools?.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolsData.tools.map((tool: any) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onCompare={handleCompare}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    const actualPage = currentPage <= 3 
                      ? page 
                      : currentPage >= totalPages - 2 
                        ? totalPages - 4 + i 
                        : currentPage - 2 + i;
                    
                    if (actualPage < 1 || actualPage > totalPages) return null;
                    
                    return (
                      <Button
                        key={actualPage}
                        variant={currentPage === actualPage ? "default" : "outline"}
                        onClick={() => setCurrentPage(actualPage)}
                        className="w-10"
                      >
                        {actualPage}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setFilters({
                  search: "",
                  pricingModel: "",
                  difficultyLevel: "",
                  rating: "",
                  sortBy: "popularity",
                });
                setCurrentPage(1);
                updateURL({
                  search: "",
                  pricingModel: "",
                  difficultyLevel: "",
                  rating: "",
                  sortBy: "popularity",
                });
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
