import { getUserSessionInclusive } from "@/actions/user";
import { signOut } from "@/auth/authOptions";
import Link from "next/link";
import SignOut from "../Auth/SignOut";


export default async function UserNavbar() {
  const user = await getUserSessionInclusive();
  if (!user) return null;


  return (
    <nav className="navbar bg-orange-500 text-white shadow-md sticky top-0 z-50 px-4">
      {/* Logo */}
      <div className="flex-1">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:text-white/90 transition"
        >
          Foxxie Learn
        </Link>
      </div>

      {/* Profile Drawer */}
      <div className="flex-none">
        <div className="drawer drawer-end z-50">
          <input id="profile-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="profile-drawer"
              className="btn btn-ghost btn-circle hover:bg-orange-600"
              aria-label="Open profile menu"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-orange-500 font-bold ring-2 ring-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </label>
          </div>

          {/* Drawer Content */}
          <div className="drawer-side">
            <label htmlFor="profile-drawer" className="drawer-overlay" />
            <aside className="menu p-6 w-80 min-h-full bg-white text-orange-700 shadow-lg">
              <div className="mb-6 border-b border-orange-200 pb-4">
                <h2 className="text-lg font-semibold text-orange-500">👤 Profile</h2>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <ul className="space-y-3">
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-orange-500 transition"
                  >
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics"
                    className="hover:text-orange-500 transition"
                  >
                    📚 Topics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/progress"
                    className="hover:text-orange-500 transition"
                  >
                    📈 My Progress
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="hover:text-orange-500 transition"
                  >
                    ⚙️ Settings
                  </Link>
                </li>
              </ul>

             <SignOut />
            </aside>
          </div>
        </div>
      </div>
    </nav>
  );
}
