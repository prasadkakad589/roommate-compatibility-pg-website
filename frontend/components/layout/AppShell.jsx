import { Home, LogOut, Menu, MessageCircle, MessagesSquare, UserRound, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { Button } from "../ui/Button.jsx";

const navItems = [
  { to: "/", label: "PGs", icon: Home },
  { to: "/matches", label: "Matches", icon: UsersRound },
  { to: "/bookings", label: "Bookings", icon: MessageCircle },
  { to: "/chat", label: "Chat", icon: MessagesSquare },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export const AppShell = () => {
  const [open, setOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-sm font-black text-white">
              R
            </span>
            <div>
              <div className="text-base font-bold leading-tight text-ink">RoomMateAI</div>
              <div className="hidden text-xs text-stone-500 sm:block">PGs and roommate matching</div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-mint text-ink" : "text-stone-600 hover:bg-white hover:text-ink"
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="max-w-36 truncate text-sm text-stone-600">{user?.name}</span>
            <Button variant="ghost" onClick={logout} title="Sign out">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 bg-white md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
            <div className="grid gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive ? "bg-mint text-ink" : "text-stone-600"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-stone-600" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
