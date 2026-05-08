import {
  BookOpen,
  Bookmark,
  Compass,
  Grid3X3,
  Home,
  Settings,
} from "lucide-react";
import Image from "next/image";

type IconSidebarProps = {
  resolvedTheme: "light" | "dark" | "sepia";
};

const icons = [
  { label: "Home", icon: Home },
  { label: "Quran", icon: BookOpen },
  { label: "Explore", icon: Compass },
  { label: "Menu", icon: Grid3X3 },
  { label: "Bookmark", icon: Bookmark },
  { label: "Settings", icon: Settings },
];

export function IconSidebar({ resolvedTheme }: IconSidebarProps) {
  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const sidebarClass = isDark
    ? "border-[#222722] bg-[#101210]"
    : isSepia
      ? "border-[#e5d9c5] bg-[#f1eadc]"
      : "border-[#e7eee8] bg-[#f5f7f5]";

  const activeClass = isDark
    ? "bg-emerald-950/30 text-emerald-400"
    : isSepia
      ? "bg-[#eadcc6] text-[#a07a50]"
      : "bg-[#eaf5e8] text-[#3d8738]";

  const inactiveClass = isDark
    ? "text-zinc-500 hover:bg-zinc-900 hover:text-emerald-400"
    : isSepia
      ? "text-[#a68b6b] hover:bg-[#eadcc6] hover:text-[#a07a50]"
      : "text-[#7f928d] hover:bg-[#eef5ed] hover:text-[#3d8738]";

  const logoClass = isSepia
    ? "object-cover sepia saturate-[0.85] contrast-[0.95]"
    : "object-cover";

  return (
    <aside
      className={`fixed left-0 top-0 z-50 hidden h-screen w-[72px] border-r lg:flex lg:flex-col lg:items-center ${sidebarClass}`}
    >
      <div className="flex h-[64px] w-full shrink-0 items-center justify-center">
        <div className="relative h-10 w-10 overflow-hidden rounded-[12px] shadow-sm">
          <Image
            src="/QuranIcon.svg"
            alt="Quran Mazid"
            fill
            priority
            className={logoClass}
            sizes="40px"
          />
        </div>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-[18px] px-3">
        {icons.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === 1;

          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              className={`flex h-11 w-11 items-center justify-center rounded-[16px] transition ${
                isActive ? activeClass : inactiveClass
              }`}
            >
              <Icon size={19} strokeWidth={2.05} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}