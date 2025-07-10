import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Position off-screen by default
        'absolute -top-40 left-6 z-50',
        // Style the link
        'bg-primary text-primary-foreground px-4 py-2 rounded-md',
        'font-medium text-sm',
        'transition-all duration-200',
        // Show when focused
        'focus:top-6 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        // Ensure it's accessible
        'sr-only focus:not-sr-only',
        className
      )}
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      <SkipLink href="#navigation">
        Skip to navigation
      </SkipLink>
      <SkipLink href="#footer">
        Skip to footer
      </SkipLink>
    </>
  );
}