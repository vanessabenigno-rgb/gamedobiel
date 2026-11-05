import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ role }: { role?: "responsavel" | "filho" }) {
  const { user, role: currentRole, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/entrar" replace />;
  if (!currentRole) return <Navigate to="/sem-perfil" replace />;
  if (role && currentRole !== role) return <Navigate to={currentRole === "responsavel" ? "/mae" : "/"} replace />;
  return <Outlet />;
}
