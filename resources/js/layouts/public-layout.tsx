import { Link } from '@inertiajs/react';
import { Facebook, GraduationCap, Instagram, Linkedin, Mail, MapPin, Menu, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV = [
    { label: 'Início', href: '/' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Estágios', href: '/estagios' },
    { label: 'Treinamentos', href: '/treinamentos' },
    { label: 'Sobre nós', href: '/sobre' },
    { label: 'Contactos', href: '/contactos' },
];

const CATEGORIES = [
    { label: 'Marketing Digital & Design Gráfico', href: '/cursos?categoria=marketing-digital-design-grafico' },
    { label: 'Tecnologia', href: '/cursos?categoria=tecnologia' },
    { label: 'Administrativos', href: '/cursos?categoria=administrativos' },
];

function Brand({ className = '', dark = false }: { className?: string; dark?: boolean }) {
    return (
        <Link href="/" className={`group flex items-center gap-2.5 rounded-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${className}`}>
            <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${dark ? 'bg-white text-primary' : 'bg-primary text-primary-foreground'}`}
            >
                <GraduationCap className="h-5 w-5" />
            </span>
            <span
                className={`text-lg leading-tight font-bold ${dark ? 'text-white' : ''}`}
                style={{ fontFamily: 'Sora, sans-serif' }}
            >
                Mundo da Tecnologia
            </span>
        </Link>
    );
}

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="public-header sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-3.5">
                    <Brand />
                    <nav className="ml-4 hidden items-center gap-1 lg:flex">
                        {NAV.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-95"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="ml-auto hidden items-center gap-2 md:flex">
                        <Button asChild variant="ghost" size="sm" className="transition-transform hover:bg-primary/10 hover:text-primary active:scale-95">
                            <Link href="/login">Entrar</Link>
                        </Button>
                        <Button asChild size="sm" className="shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95">
                            <Link href="/register">Criar conta</Link>
                        </Button>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="ml-auto transition-all hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 lg:hidden" aria-label="Menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <div className="mt-6 flex flex-col gap-1 px-2">
                                <Brand className="mb-4 px-2" />
                                {NAV.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-md px-2 py-2.5 text-sm font-medium transition-all hover:bg-primary/10 hover:pl-3 hover:text-primary active:scale-[.98]"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="mt-4 flex flex-col gap-2 px-1">
                                    <Button asChild variant="outline" className="transition-all hover:border-primary hover:bg-primary/10 active:scale-[.98]">
                                        <Link href="/login">Entrar</Link>
                                    </Button>
                                    <Button asChild className="transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[.98]">
                                        <Link href="/register">Criar conta</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

            <footer className="mt-8 bg-primary text-primary-foreground">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Brand dark />
                        <p className="mt-4 max-w-xs text-sm text-primary-foreground/80">
                            Elevando você. Formação profissional certificada, estágios e treinamentos para empresas.
                        </p>
                        <div className="mt-4 flex gap-2">
                            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 text-white transition-colors hover:bg-white hover:text-primary"
                                    aria-label="Rede social"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Links rápidos</h3>
                        <ul className="mt-3 flex flex-col gap-2 text-sm text-primary-foreground/80">
                            {NAV.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="transition-colors hover:text-white active:opacity-70">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Cursos</h3>
                        <ul className="mt-3 flex flex-col gap-2 text-sm text-primary-foreground/80">
                            {CATEGORIES.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="transition-colors hover:text-white active:opacity-70">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Contactos</h3>
                        <ul className="mt-3 flex flex-col gap-3 text-sm text-primary-foreground/80">
                            <li className="flex gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 flex-none text-white" />
                                <span>Rangel, Vila Alice, Rua João de Deus, Luanda · Zango III, Primeira Paragem</span>
                            </li>
                            <li className="flex gap-2.5">
                                <Phone className="mt-0.5 h-4 w-4 flex-none text-white" />
                                <span>932 407 153 · 922 900 498</span>
                            </li>
                            <li className="flex gap-2.5">
                                <Mail className="mt-0.5 h-4 w-4 flex-none text-white" />
                                <span>geral@mundotec.ao</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/15">
                    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/70 sm:flex-row">
                        <span>© {new Date().getFullYear()} Mundo da Tecnologia · Todos os direitos reservados</span>
                        <span className="flex gap-4">
                            <a href="#" className="hover:text-white">
                                Termos
                            </a>
                            <a href="#" className="hover:text-white">
                                Privacidade
                            </a>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
