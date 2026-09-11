import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="border-b">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
                    <Link href="/cursos" className="text-lg font-semibold tracking-tight">
                        Mundo da Tecnologia
                    </Link>
                    <nav className="flex items-center gap-2">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/cursos">Cursos</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/login">Entrar</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

            <footer className="border-t">
                <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Mundo da Tecnologia · Elevando você
                </div>
            </footer>
        </div>
    );
}
