import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className="relative w-screen h-dvh overflow-hidden bg-[#030303] text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 select-none">
      {/* Decorative Elegant Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-950/10 blur-[120px] pointer-events-none" />
      
      {/* Header / Brand */}
      <header className="w-full py-6 px-8 flex justify-between items-center z-10">
        <span className="font-serif italic text-lg tracking-wider bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          unwrap.
        </span>
      </header>

      {/* Main Experience Area */}
      <main className="flex-1 w-full relative z-10 flex items-center justify-center overflow-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-8 flex justify-between items-center z-10">
        <div />
      </footer>
    </div>
  );
};
