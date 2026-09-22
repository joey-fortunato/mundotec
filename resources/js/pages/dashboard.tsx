import { Head, Link, usePage } from '@inertiajs/react';
import { Award, CheckCircle2, PlayCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

type Props = {
    stats: { active_courses: number; completed_lessons: number; certificates: number };
    continue: { course_title: string; course_slug: string; progress: number } | null;
    pendingPayment: { course_title: string; total: string; currency: string; enrollment_id: number } | null;
};

function money(value: string, currency: string) {
    return `${Number(value).toLocaleString('pt-PT', { maximumFractionDigits: 0 })} ${currency}`;
}

export default function Dashboard() {
    const page = usePage<{ auth: Auth } & Props>();
    const { auth, stats, pendingPayment } = page.props;
    const cont = page.props.continue;
    const firstName = auth.user.name.split(' ')[0];

    return (
        <div className="flex flex-col gap-6 p-4">
            <Head title="Painel" />

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Olá, {firstName}</h1>
                <p className="mt-1 text-muted-foreground">Continua de onde paraste.</p>
            </div>

            {cont && (
                <div className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground">
                    <div className="relative">
                        <div className="text-xs font-semibold tracking-wide opacity-85">A CONTINUAR</div>
                        <div className="mt-1.5 text-xl font-semibold">{cont.course_title}</div>
                        <div className="mt-3 h-2 w-72 max-w-full rounded-full bg-white/20">
                            <div className="h-2 rounded-full bg-white" style={{ width: `${cont.progress}%` }} />
                        </div>
                        <div className="mt-1.5 text-xs opacity-85">{cont.progress}% concluído</div>
                    </div>
                    <Button asChild variant="secondary" className="relative">
                        <Link href={`/aprender/${cont.course_slug}`}>
                            <PlayCircle className="mr-2 h-4 w-4" /> Retomar
                        </Link>
                    </Button>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <PlayCircle className="h-4 w-4 text-primary" /> Cursos ativos
                        </div>
                        <div className="mt-2 text-3xl font-bold">{stats.active_courses}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-green-600" /> Aulas concluídas
                        </div>
                        <div className="mt-2 text-3xl font-bold">{stats.completed_lessons}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="h-4 w-4 text-primary" /> Certificados
                        </div>
                        <div className="mt-2 text-3xl font-bold">{stats.certificates}</div>
                    </CardContent>
                </Card>
            </div>

            {pendingPayment && (
                <Card>
                    <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Pagamento em curso</div>
                            <div className="mt-1 font-semibold">{pendingPayment.course_title}</div>
                            <div className="mt-1 text-lg font-bold">
                                {money(pendingPayment.total, pendingPayment.currency)}
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={`/matriculas/${pendingPayment.enrollment_id}/pagamento`}>
                                <Smartphone className="mr-2 h-4 w-4" /> Pagar com Multicaixa Express
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Painel', href: dashboard() }],
};
