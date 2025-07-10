import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function LoadingState({ 
  isLoading, 
  children, 
  fallback, 
  className 
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        {fallback || <DefaultLoadingSkeleton />}
      </div>
    );
  }

  return <>{children}</>;
}

function DefaultLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 shimmer"></div>
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6', className)}>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 shimmer mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full shimmer"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 shimmer"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16 shimmer"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20 shimmer"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20 shimmer"></div>
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 shimmer mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4, className }: { 
  rows?: number; 
  columns?: number; 
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {/* Header */}
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-4 bg-gray-200 rounded shimmer"></div>
        ))}
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={`row-${rowIndex}-col-${colIndex}`} 
              className="h-3 bg-gray-200 rounded shimmer"
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export function PulseDot({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
    </div>
  );
}

export function SpinnerLoader({ 
  size = 'md', 
  className 
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
        sizeClasses[size]
      )}></div>
    </div>
  );
}

export function ProgressBar({ 
  progress, 
  className,
  showPercentage = false 
}: { 
  progress: number;
  className?: string;
  showPercentage?: boolean;
}) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Loading...</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}