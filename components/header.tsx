"use client";

export function Header() {
  return (
    <header className="h-14 bg-primary flex items-center justify-between px-6">
      <h1 className="text-white font-semibold text-lg">NWG Product Hub</h1>
      <span className="text-primary-hover text-sm">
        Nordic Well Group · Internal Tool
      </span>
    </header>
  );
}
