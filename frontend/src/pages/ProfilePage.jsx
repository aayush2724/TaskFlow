import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateProfile } from "../features/auth/authSlice";
import { selectTheme, setTheme } from "../features/theme/themeSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const [name, setName] = useState(user?.profile?.name || "");
  const [avatar, setAvatar] = useState(user?.profile?.avatar || "");

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(updateProfile({ name, avatar, theme }));
        }}
        className="rounded-lg border border-white/10 bg-slate-950/35 p-6 shadow-panel"
      >
        <h3 className="text-lg font-semibold text-white">Profile</h3>
        <div className="mt-5 space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white outline-none"
          />
          <input
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white outline-none"
          />
          <select
            value={theme}
            onChange={(event) => dispatch(setTheme(event.target.value))}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white outline-none"
          >
            <option className="text-slate-950">dark</option>
            <option className="text-slate-950">light</option>
            <option className="text-slate-950">system</option>
          </select>
          <button type="submit" className="rounded-md bg-teal px-4 py-3 font-medium text-slate-950">
            Save changes
          </button>
        </div>
      </form>

      <section className="rounded-lg border border-white/10 bg-slate-950/35 p-6 shadow-panel">
        <div className="flex items-center gap-4">
          <img src={user?.profile?.avatar} alt={user?.profile?.name} className="h-20 w-20 rounded-lg object-cover" />
          <div>
            <h3 className="text-xl font-semibold text-white">{user?.profile?.name}</h3>
            <p className="text-sm text-slate-300">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-md bg-white/8 p-4">
            <div className="text-sm text-slate-300">XP</div>
            <div className="mt-2 text-3xl font-semibold text-white">{user?.gamification?.xp || 0}</div>
          </div>
          <div className="rounded-md bg-white/8 p-4">
            <div className="text-sm text-slate-300">Current Streak</div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {user?.gamification?.currentStreak || 0}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm text-slate-300">Badges</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {user?.badges?.length ? (
              user.badges.map((badge) => (
                <span key={badge} className="rounded-md bg-coral px-3 py-2 text-sm font-medium text-slate-950">
                  {badge}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-300">No badges yet.</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
