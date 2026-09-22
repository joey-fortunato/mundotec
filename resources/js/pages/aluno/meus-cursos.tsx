import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Enrollment = {
    id: number;
    course_title: string;
    course_slug: string;
    status: string;
    status_label: string;
    progress_percent: number;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    active: 'default',
    pending: 'secondary',
    completed: 'outline',
    cancelled: 'outline',
};

export default function MyCourses({
    enrollments,
}: {
    enrollments: Enrollment[];
}) {
    return (
        <div className="mx-auto w-full max-w-3xl p-4">
            <Head title="Os meus cursos" />
            <Heading
                title="Os meus cursos"
                description="As tuas inscrições e o estado de cada uma."
            />

            {enrollments.length === 0 ? (
                <Card className="flex flex-col items-center gap-3 p-10 text-center">
                    <p className="text-muted-foreground">
                        Ainda não te inscreveste em nenhum curso.
                    </p>
                    <Button asChild>
                        <Link href="/cursos">Ver cursos</Link>
                    </Button>
                </Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {enrollments.map((e) => (
                        <Card key={e.id}>
                            <CardContent className="flex items-center justify-between gap-4 pt-6">
                                <div>
                                    <p className="font-medium">
                                        {e.course_title}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Badge
                                            variant={
                                                statusVariant[e.status] ??
                                                'secondary'
                                            }
                                        >
                                            {e.status_label}
                                        </Badge>
                                        {e.status === 'active' && (
                                            <span className="text-sm text-muted-foreground">
                                                {e.progress_percent}% concluído
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {e.status === 'pending' ? (
                                    <Button asChild variant="outline">
                                        <Link
                                            href={`/matriculas/${e.id}/pagamento`}
                                        >
                                            Concluir pagamento
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild>
                                        <Link href={`/aprender/${e.course_slug}`}>
                                            {e.status === 'completed'
                                                ? 'Rever curso'
                                                : 'Continuar'}
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

MyCourses.layout = {
    breadcrumbs: [{ title: 'Os meus cursos', href: '/os-meus-cursos' }],
};
