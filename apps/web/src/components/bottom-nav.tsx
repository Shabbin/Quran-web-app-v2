import {
  BookOpen,
  Bookmark,
  Compass,
  Grid3X3,
  Home,
} from "lucide-react";

type BottomNavProps = {
  resolvedTheme: "light" | "dark" | "sepia";
};

const items = [
  { label: "Home", icon: Home },
  { label: "Read", icon: BookOpen },
  { label: "Explore", icon: Compass },
  { label: "Saved", icon: Bookmark },
  { label: "Menu", icon: Grid3X3 },
];

export function BottomNav({ resolvedTheme }: BottomNavProps) {
  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const navClass = isDark
    ? "border-[#222722] bg-[#101210]"
    : isSepia
      ? "border-[#e8dcc9] bg-[#f6f1e7]"
      : "border-[#e7eee8] bg-white";

  const activeClass = isDark
    ? "text-emerald-400"
    : isSepia
      ? "text-[#a07a50]"
      : "text-[#3d8738]";

  const inactiveClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#a58d70]"
      : "text-[#8ca09a]";

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 border-t px-2 pb-2 pt-1 lg:hidden ${navClass}`}
    >
      <div className="grid grid-cols-5">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === 1;

          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              className={`flex h-10 items-center justify-center rounded-2xl transition ${
                isActive ? activeClass : inactiveClass
              }`}
            >
              <Icon size={20} strokeWidth={2.1} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}