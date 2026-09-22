import { Head, Link } from '@inertiajs/react';
import {
    Award,
    FileSpreadsheet,
    Megaphone,
    Network,
    PlayCircle
    
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Enrollment = {
    id: number;
    course_title: string;
    course_slug: string;
    category_slug: string | null;
    status: string;
    status_label: string;
    progress_percent: number;
};

const CATEGORY_ICON: Record<string, LucideIcon> = {
    tecnologia: Network,
    'marketing-design-grafico': Megaphone,
    administrativos: FileSpreadsheet,
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    active: 'default',
    pending: 'secondary',
    completed: 'default',
    cancelled: 'outline',
};

export default function MyCourses({ enrollments }: { enrollments: Enrollment[] }) {
    return (
        <div className="mx-auto w-full max-w-3xl p-4">
            <Head title="Os meus cursos" />
            <Heading title="Os meus cursos" description="As tuas inscrições e o estado de cada uma." />

            {enrollments.length === 0 ? (
                <Card className="flex flex-col items-center gap-3 p-10 text-center">
                    <p className="text-muted-foreground">Ainda não te inscreveste em nenhum curso.</p>
                    <Button asChild>
                        <Link href="/cursos">Ver cursos</Link>
                    </Button>
                </Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {enrollments.map((e) => {
                        const Icon = (e.category_slug && CATEGORY_ICON[e.category_slug]) || Network;
                        const isPending = e.status === 'pending';
                        const isCompleted = e.status === 'completed';

                        return (
                            <Card key={e.id}>
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="flex h-16 w-24 flex-none items-center justify-center rounded-lg bg-primary/8">
                                        <Icon className="h-7 w-7 text-primary/40" strokeWidth={1.5} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-semibold">{e.course_title}</span>
                                            <Badge variant={statusVariant[e.status] ?? 'secondary'}>{e.status_label}</Badge>
                                        </div>
                                        {isPending ? (
                                            <p className="mt-1.5 text-sm text-muted-foreground">
                                                Conclui o pagamento por Multicaixa Express para libertar o acesso.
                                            </p>
                                        ) : (
                                            <div className="mt-2.5 flex items-center gap-2.5">
                                                <div className="h-1.5 w-56 max-w-full rounded-full bg-muted">
                                                    <div
                                                        className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-primary'}`}
                                                        style={{ width: `${e.progress_percent}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground">{e.progress_percent}%</span>
                                            </div>
                                        )}
                                    </div>
                                    {isPending ? (
                                        <Button asChild variant="outline">
                                            <Link href={`/matriculas/${e.id}/pagamento`}>Pagar agora</Link>
                                        </Button>
                                    ) : isCompleted ? (
                                        <Button asChild variant="outline">
                                            <Link href="/certificados">
                                                <Award className="mr-1.5 h-4 w-4" /> Certificado
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button asChild>
                                            <Link href={`/aprender/${e.course_slug}`}>
                                                <PlayCircle className="mr-1.5 h-4 w-4" /> Continuar
                                            </Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

MyCourses.layout = {
    breadcrumbs: [{ title: 'Os meus cursos', href: '/os-meus-cursos' }],
};
