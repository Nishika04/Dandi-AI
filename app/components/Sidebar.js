"use client";
import Link from "next/link";

const navLinks = [
  { name: "Overview", href: "/dashboards", icon: "🏠" },
  { name: "Research Assistant", href: "#", icon: "✨" },
  { name: "Research Reports", href: "#", icon: "📁" },
  { name: "API Playground", href: "/playground", icon: "💻" },
  { name: "Invoices", href: "#", icon: "🧾" },
  { name: "Documentation", href: "#", icon: "📄", external: true },
];

export default function Sidebar({ active = "Overview" }) {
  return (
    <aside className="h-screen w-64 bg-white rounded-2xl shadow flex flex-col justify-between p-6">
      <div>
        <div className="text-2xl font-bold mb-8 tracking-tight text-gray-800">
          Dandi <span className="text-purple-600">AI</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                active === link.name
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
              {link.external && (
                <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 mt-8">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-base font-bold text-gray-800">N</div>
        <div>
          <div className="font-semibold text-gray-800 text-sm">Nishika Singhvi</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>
      </div>
    </aside>
  );
}
