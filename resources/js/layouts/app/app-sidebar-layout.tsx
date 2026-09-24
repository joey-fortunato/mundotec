import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AppSidebarNav } from '@/components/app-sidebar-nav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="hidden w-60 flex-none border-r bg-card lg:block">
                <div className="sticky top-0 h-screen">
                    <AppSidebarNav />
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center gap-3 border-b bg-card px-4 py-2.5 lg:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <AppSidebarNav onNavigate={() => setOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <span className="text-[15px] font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                        MundoTec
                    </span>
                </header>

                <main className="min-w-0 flex-1">{children}</main>
            </div>
        </div>
    );
}
