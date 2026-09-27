import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050507] border-t border-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left">
          <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
            HackMate
          </span>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <p className="text-xs text-zinc-400">Find your people. Build something amazing.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Documentation
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Community Discord
          </a>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Systems Operational</span>
          </div>
          <span className="text-zinc-500">© 2025 HackMate</span>
        </div>
      </div>
    </footer>
  );
};
