import React, { useEffect } from "react";
import { useAuth, useRouter } from "./context/AppContext";
import Layout              from "./components/Layout";
import StartPage           from "./pages/StartPage";
import LoginPage           from "./pages/LoginPage";
import RegisterPage        from "./pages/RegisterPage";
import DashboardPage       from "./pages/DashboardPage";
import AccountsPage        from "./pages/AccountsPage";
import AccountDetailPage   from "./pages/AccountDetailPage";
import TransactionsPage    from "./pages/TransactionsPage";
import ProfilePage         from "./pages/ProfilePage";

const PUBLIC_ROUTES = new Set(["start", "login", "register"]);

export default function App() {
  const { isLoggedIn }      = useAuth();
  const { route, navigate } = useRouter();

  // Route guards — hooks always called, never conditional
  useEffect(() => {
    if (!isLoggedIn && !PUBLIC_ROUTES.has(route)) {
      navigate("start");
    }
    if (isLoggedIn && PUBLIC_ROUTES.has(route)) {
      navigate("dashboard");
    }
  }, [isLoggedIn, route, navigate]);

  // Full-screen auth pages
  if (!isLoggedIn) return <RouteSwitch />;

  // Authenticated pages with shared navbar
  return (
    <Layout>
      <RouteSwitch />
    </Layout>
  );
}

function RouteSwitch() {
  const { route } = useRouter();
  switch (route) {
    case "start":          return <StartPage />;
    case "login":          return <LoginPage />;
    case "register":       return <RegisterPage />;
    case "dashboard":      return <DashboardPage />;
    case "accounts":       return <AccountsPage />;
    case "account-detail": return <AccountDetailPage />;
    case "transactions":   return <TransactionsPage />;
    case "profile":        return <ProfilePage />;
    default:               return <StartPage />;
  }
}
