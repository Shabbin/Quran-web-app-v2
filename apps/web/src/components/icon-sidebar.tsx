import {
  BookOpen,
  Bookmark,
  Compass,
  Grid3X3,
  Home,
  Settings,
} from "lucide-react";

const icons = [
  { label: "Home", icon: Home },
  { label: "Quran", icon: BookOpen },
  { label: "Explore", icon: Compass },
  { label: "Menu", icon: Grid3X3 },
  { label: "Bookmark", icon: Bookmark },
  { label: "Settings", icon: Settings },
];

export function IconSidebar() {
  return (
    <aside className="hidden h-screen w-[72px] shrink-0 border-r border-emerald-100 bg-white px-3 py-5 lg:flex lg:flex-col lg:items-center">
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white">
        ق
      </div>

      <nav className="flex flex-1 flex-col items-center gap-3">
        {icons.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                index === 1
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-400 hover:bg-slate-50 hover:text-emerald-700"
              }`}
              aria-label={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}