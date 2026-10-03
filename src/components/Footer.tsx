import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-900">HackMate</span>
          <p className="text-xs text-slate-500">Find your people. Build something amazing.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 md:justify-end">
          <span>Community</span>
          <span>Docs</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Systems operational
          </span>
        </div>
      </div>
    </footer>
  );
};
