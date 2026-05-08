import { BookOpen, Bookmark, Home, Search, Settings } from "lucide-react";

const items = [
  { label: "Home", icon: Home },
  { label: "Read", icon: BookOpen },
  { label: "Search", icon: Search },
  { label: "Saved", icon: Bookmark },
  { label: "Setting", icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-emerald-100 bg-white px-2 py-2 lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] ${
                index === 1 ? "text-emerald-700" : "text-slate-400"
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}