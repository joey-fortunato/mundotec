import { Head } from '@inertiajs/react';
import { Award, BarChart3, TrendingUp, UserPlus, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
    stats: { revenue: string; new_students: number; active_enrollments: number; certificates: number };
    topCourses: { title: string; enrollments: number }[];
    monthlyActivity: { label: string; revenue: number; enrollments: number }[];
    recent: { student: string; course: string; status: string; status_label: string; date: string | null }[];
};

function compact(value: string) {
    const n = Number(value);

    return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n.toLocaleString('pt-PT', { maximumFractionDigits: 0 });
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    active: 'default',
    pending: 'secondary',
    completed: 'outline',
};

export default function AdminDashboard({ stats, topCourses, monthlyActivity, recent }: Props) {
    const max = Math.max(1, ...topCourses.map((c) => c.enrollments));
    const cards = [
        [TrendingUp, 'Receita (mês)', `${compact(stats.revenue)} AOA`],
        [UserPlus, 'Novos alunos', String(stats.new_students)],
        [Users, 'Inscrições ativas', String(stats.active_enrollments)],
        [Award, 'Certificados', String(stats.certificates)],
    ] as const;

    return (
        <div className="flex flex-col gap-6 p-4">
            <Head title="Painel" />
            <Heading title="Painel" description="Visão geral da plataforma." />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map(([Icon, label, value]) => (
                    <Card key={label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon className="h-4 w-4 text-primary" /> {label}
                            </div>
                            <div className="mt-2 text-2xl font-bold">{value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="lg:col-span-2">
                    <CardContent className="pt-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Crescimento da plataforma</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Receita confirmada e inscrições dos últimos seis meses.</p>
                            </div>
                            <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="grid h-44 grid-cols-6 items-end gap-3 border-b border-dashed pb-1">
                            {monthlyActivity.map((month) => {
                                const revenueMax = Math.max(1, ...monthlyActivity.map((item) => item.revenue));
                                const enrollmentMax = Math.max(1, ...monthlyActivity.map((item) => item.enrollments));
                                const revenueHeight = Math.max(4, (month.revenue / revenueMax) * 100);
                                const enrollmentHeight = Math.max(4, (month.enrollments / enrollmentMax) * 100);

                                return (
                                    <div key={month.label} className="group flex h-full min-w-0 flex-col justify-end gap-1.5 text-center">
                                        <div className="relative flex h-full items-end justify-center gap-1">
                                            <div className="w-3 rounded-t bg-primary/25 transition-all group-hover:bg-primary/40" style={{ height: `${enrollmentHeight}%` }} title={`${month.enrollments} inscrições`} />
                                            <div className="w-3 rounded-t bg-primary transition-all group-hover:bg-primary/75" style={{ height: `${revenueHeight}%` }} title={`${compact(String(month.revenue))} AOA`} />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{month.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 flex gap-4 text-xs text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-primary/25" />Inscrições</span><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-primary" />Receita</span></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="mb-4 font-semibold">Cursos mais vendidos</h3>
                        <div className="flex flex-col gap-3.5">
                            {topCourses.map((c) => (
                                <div key={c.title}>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span className="font-medium">{c.title}</span>
                                        <span className="text-muted-foreground">{c.enrollments}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted">
                                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(c.enrollments / max) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                            {topCourses.length === 0 && <p className="text-sm text-muted-foreground">Sem dados ainda.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <h3 className="mb-4 font-semibold">Atividade recente</h3>
                        <div className="flex flex-col">
                            {recent.map((r, i) => (
                                <div key={i} className="flex items-center justify-between border-b py-2.5 text-sm last:border-0">
                                    <span>
                                        <strong>{r.student}</strong> · {r.course}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={statusVariant[r.status] ?? 'secondary'}>{r.status_label}</Badge>
                                        <span className="text-xs text-muted-foreground">{r.date}</span>
                                    </div>
                                </div>
                            ))}
                            {recent.length === 0 && <p className="text-sm text-muted-foreground">Sem atividade ainda.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Painel', href: '/admin' }],
};
