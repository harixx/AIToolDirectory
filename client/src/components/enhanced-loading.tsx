import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Zap, Star } from "lucide-react";

interface EnhancedLoadingProps {
  variant?: 'skeleton' | 'spinner' | 'pulse' | 'shimmer';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showIcon?: boolean;
  className?: string;
}

export function EnhancedLoading({ 
  variant = 'skeleton', 
  size = 'md',
  message = "Loading amazing AI tools",
  showIcon = true,
  className = ""
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const iconClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  if (variant === 'skeleton') {
    return (
      <div className={`space-y-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6 animate-pulse" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 py-12 ${className}`}>
        {showIcon && (
          <div className="relative">
            <Loader2 className={`${iconClasses[size]} animate-spin text-primary`} />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          </div>
        )}
        <div className="text-center">
          <p className="text-gray-600 font-medium">{message}</p>
          <div className="loading-dots text-primary mt-2">Loading</div>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center space-x-2 py-8 ${className}`}>
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-100" />
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-200" />
      </div>
    );
  }

  if (variant === 'shimmer') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative overflow-hidden bg-gray-200 rounded-lg h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <Sparkles className={`${iconClasses[size]} text-primary animate-pulse`} />
    </div>
  );
}

// Enhanced loading for specific use cases
export function ToolCardLoading() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg loading-skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded loading-skeleton" />
            <div className="h-3 bg-gray-200 rounded w-3/4 loading-skeleton" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded loading-skeleton" />
          <div className="h-3 bg-gray-200 rounded w-5/6 loading-skeleton" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full loading-skeleton" />
            <div className="h-6 w-16 bg-gray-200 rounded-full loading-skeleton" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded loading-skeleton" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Searching AI Tools</h3>
          <p className="text-gray-600 loading-dots">Finding the best matches for you</p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ 
  title = "No results found",
  description = "Try adjusting your search criteria or browse our categories",
  actionLabel = "Browse All Tools",
  onAction
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <Star className="w-12 h-12 text-primary/60" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center"
        >
          <Zap className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}