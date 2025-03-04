import { createContext, FC, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <AuthContext.Provider value={{ user: data, isLoading, isError, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
