import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Video, Image, Code, Grid3x3 } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "fas fa-video":
        return <Video className="w-4 h-4" />;
      case "fas fa-image":
        return <Image className="w-4 h-4" />;
      case "fas fa-code":
        return <Code className="w-4 h-4" />;
      default:
        return <Grid3x3 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
      case "green":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "blue":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-10 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {/* All Categories Button */}
          <Link href="/tools">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                !selectedCategory 
                  ? "bg-primary text-white" 
                  : "hover:bg-primary/10"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              All Categories
            </Button>
          </Link>

          {/* Category Buttons */}
          {categories?.map((category: any) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Button
                variant={selectedCategory === category.slug ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.slug
                    ? "bg-primary text-white"
                    : getCategoryColor(category.color)
                }`}
              >
                {getCategoryIcon(category.icon)}
                {category.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Category Description */}
        {selectedCategory && categories && (
          <div className="mt-6 text-center">
            {(() => {
              const category = categories.find((c: any) => c.slug === selectedCategory);
              if (category) {
                return (
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h2>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>
    </section>
  );
}
