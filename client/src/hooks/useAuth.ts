import { useQuery } from "@tanstack/react-query";

// Create a singleton query key to ensure only one auth request happens
const AUTH_QUERY_KEY = ['auth-user'];

// Global state to prevent multiple simultaneous requests
let authPromise: Promise<any> | null = null;
let cachedUser: any = null;
let cacheTime = 0;

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const now = Date.now();
      
      // Return cached result if it's still fresh (within 5 minutes)
      if (cachedUser && (now - cacheTime) < 300000) {
        return cachedUser;
      }
      
      // If there's already a pending request, wait for it
      if (authPromise) {
        return authPromise;
      }
      
      // Create new request
      authPromise = fetch('/api/auth/user', {
        credentials: 'include',
      }).then(async (response) => {
        let result = null;
        
        if (response.status === 401) {
          result = null;
        } else if (!response.ok) {
          throw new Error('Failed to fetch user');
        } else {
          result = await response.json();
        }
        
        // Update cache
        cachedUser = result;
        cacheTime = now;
        authPromise = null;
        
        return result;
      }).catch((error) => {
        authPromise = null;
        throw error;
      });
      
      return authPromise;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnMount: false,
    // Enable query deduplication
    networkMode: 'always',
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
