import { useQuery } from "@tanstack/react-query";

// Create a singleton query key to ensure only one auth request happens
const AUTH_QUERY_KEY = ['auth-user'];

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
      });
      
      if (response.status === 401) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      return response.json();
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
