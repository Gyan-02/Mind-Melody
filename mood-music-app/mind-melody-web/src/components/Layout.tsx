import type { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className="h-screen w-full bg-background text-text-primary overflow-hidden grid grid-cols-[240px_1fr] grid-rows-[1fr_90px]">
            {/* Sidebar - Row 1, Col 1 */}
            <aside className="row-span-1 col-span-1 overflow-hidden">
                <Sidebar />
            </aside>

            {/* Main Content - Row 1, Col 2 */}
            <main className="row-span-1 col-span-1 overflow-y-auto custom-scrollbar relative bg-gradient-to-b from-surface to-background">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent pointer-events-none" />
                <div className="relative z-10 p-8 pb-32">
                    {children}
                </div>
            </main>

            {/* Player - Row 2, Spans both cols */}
            <footer className="row-start-2 col-span-2 z-50">
                <Player />
            </footer>
        </div>
    );
};

export default Layout;
