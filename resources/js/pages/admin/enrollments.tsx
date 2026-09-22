import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type Enrollment = {
    id: number;
    student: string;
    student_email: string;
    course: string;
    status: string;
    status_label: string;
    progress_percent: number;
    enrolled_at: string | null;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    active: 'default',
    pending: 'secondary',
    completed: 'outline',
    cancelled: 'outline',
};

export default function AdminEnrollments({ enrollments }: { enrollments: Enrollment[] }) {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Head title="Inscrições" />
            <Heading title="Inscrições" description="Alunos inscritos e progresso por curso." />

            {enrollments.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground">Ainda não há inscrições.</Card>
            ) : (
                <Card className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Aluno</th>
                                <th className="px-4 py-3 font-medium">Curso</th>
                                <th className="px-4 py-3 font-medium">Progresso</th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 font-medium">Inscrição</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((e) => (
                                <tr key={e.id} className="border-b last:border-0">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{e.student}</div>
                                        <div className="text-xs text-muted-foreground">{e.student_email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{e.course}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-24 rounded-full bg-muted">
                                                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${e.progress_percent}%` }} />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{e.progress_percent}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[e.status] ?? 'secondary'}>{e.status_label}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{e.enrolled_at ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
}

AdminEnrollments.layout = {
    breadcrumbs: [{ title: 'Inscrições', href: '/admin/inscricoes' }],
};
