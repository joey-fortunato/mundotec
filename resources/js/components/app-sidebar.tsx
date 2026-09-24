import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    ClipboardList,
    Compass,
    CreditCard,
    GraduationCap,
    LayoutGrid,
    PlayCircle,
    Settings,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const studentLearning: NavItem[] = [
    { title: 'Painel', href: dashboard(), icon: LayoutGrid },
    { title: 'Explorar cursos', href: '/cursos', icon: Compass },
    { title: 'Os meus cursos', href: '/os-meus-cursos', icon: PlayCircle },
    { title: 'Certificados', href: '/certificados', icon: Award },
];

const studentAccount: NavItem[] = [
    { title: 'Pagamentos', href: '/faturas', icon: CreditCard },
    { title: 'Definições', href: '/settings/profile', icon: Settings },
];

const adminPlatform: NavItem[] = [
    { title: 'Painel', href: '/admin', icon: LayoutGrid },
    { title: 'Cursos', href: '/admin/courses', icon: GraduationCap },
    { title: 'Categorias', href: '/admin/categories', icon: Tags },
    { title: 'Certificados', href: '/admin/certificados', icon: Award },
    { title: 'Instrutores', href: '/admin/instrutores', icon: Users },
];

const adminManagement: NavItem[] = [
    { title: 'Inscrições', href: '/admin/inscricoes', icon: ClipboardList },
    { title: 'Pagamentos', href: '/admin/pagamentos', icon: CreditCard },
    { title: 'Definições', href: '/settings/profile', icon: Settings },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? '/admin' : dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {isAdmin ? (
                    <>
                        <NavMain items={adminPlatform} label="Plataforma" />
                        <NavMain items={adminManagement} label="Gestão" />
                    </>
                ) : (
                    <>
                        <NavMain items={studentLearning} label="Aprendizagem" />
                        <NavMain items={studentAccount} label="Conta" />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
