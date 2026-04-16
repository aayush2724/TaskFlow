import { LogOut, MoonStar, Sparkles, SunMedium } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/auth/authSlice";
import { selectTheme, setTheme } from "../features/theme/themeSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);

  return (
    <header className="flex flex-col gap-4 rounded-lg border border-white/10 bg-slate-950/35 p-4 shadow-panel backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm text-mint">
          <Sparkles size={16} />
          <span>{user?.gamification?.xp || 0} XP</span>
        </div>
        <h2 className="mt-1 text-xl font-semibold text-white">Welcome back, {user?.profile?.name}</h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-slate-100 transition hover:border-mint/60"
        >
          {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="inline-flex items-center gap-2 rounded-md bg-coral px-3 py-2 text-sm font-medium text-slate-950"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
