import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    ClipboardList,
    Compass,
    CreditCard,
    GraduationCap,
    LayoutGrid,
    LogOut,
    PlayCircle,
    Settings,
    Tags,
    Users,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';

type Item = { title: string; href: string; icon: LucideIcon };
type Group = { label: string; items: Item[] };

const STUDENT_GROUPS: Group[] = [
    {
        label: 'Aprendizagem',
        items: [
            { title: 'Painel', href: dashboard().url, icon: LayoutGrid },
            { title: 'Explorar cursos', href: '/cursos', icon: Compass },
            { title: 'Os meus cursos', href: '/os-meus-cursos', icon: PlayCircle },
            { title: 'Certificados', href: '/certificados', icon: Award },
        ],
    },
    {
        label: 'Conta',
        items: [
            { title: 'Pagamentos', href: '/faturas', icon: CreditCard },
            { title: 'Definições', href: '/settings/profile', icon: Settings },
        ],
    },
];

const ADMIN_GROUPS: Group[] = [
    {
        label: 'Plataforma',
        items: [
            { title: 'Painel', href: '/admin', icon: LayoutGrid },
            { title: 'Cursos', href: '/admin/courses', icon: GraduationCap },
            { title: 'Categorias', href: '/admin/categories', icon: Tags },
            { title: 'Certificados', href: '/admin/certificados', icon: Award },
            { title: 'Instrutores', href: '/admin/instrutores', icon: Users },
        ],
    },
    {
        label: 'Gestão',
        items: [
            { title: 'Inscrições', href: '/admin/inscricoes', icon: ClipboardList },
            { title: 'Pagamentos', href: '/admin/pagamentos', icon: CreditCard },
            { title: 'Definições', href: '/settings/profile', icon: Settings },
        ],
    },
];

const ROLE_LABEL: Record<string, string> = {
    admin: 'Administrador',
    instructor: 'Instrutor',
    student: 'Aluno',
};

function initials(name: string) {
    return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

export function AppSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
    const { auth } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();
    const isAdmin = auth.user?.role === 'admin';
    const groups = isAdmin ? ADMIN_GROUPS : STUDENT_GROUPS;
    const homeHref = isAdmin ? '/admin' : dashboard().url;

    return (
        <div className="flex h-full flex-col p-3">
            <Link href={homeHref} onClick={onNavigate} className="flex items-center gap-2.5 px-2 py-1.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GraduationCap className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[15px] font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                    MundoTec
                </span>
            </Link>

            <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto">
                {groups.map((group) => (
                    <div key={group.label} className="mt-3 first:mt-1">
                        <div className="px-3 pb-1 text-[10.5px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                            {group.label}
                        </div>
                        {group.items.map((item) => {
                            const active = isCurrentUrl(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={onNavigate}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="h-[17px] w-[17px] flex-none" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {auth.user && (
                <div className="mt-2 flex items-center gap-2.5 border-t pt-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {initials(auth.user.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{auth.user.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{ROLE_LABEL[auth.user.role] ?? 'Aluno'}</div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Sair"
                    >
                        <LogOut className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
