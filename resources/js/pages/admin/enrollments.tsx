import { Head, useForm } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

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
type Option = { id: number; name?: string; title?: string };

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    active: 'default',
    pending: 'secondary',
    completed: 'outline',
    cancelled: 'outline',
};

function NewEnrollmentDialog({ students, courses }: { students: Option[]; courses: Option[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ user_id: '', course_id: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/inscricoes', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nova inscrição
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Inscrever aluno manualmente</DialogTitle>
                        <DialogDescription>O acesso ao curso é libertado de imediato, sem pagamento.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Aluno</Label>
                            <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Escolher aluno" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Curso</Label>
                            <Select value={data.course_id} onValueChange={(v) => setData('course_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Escolher curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.course_id && <p className="text-sm text-destructive">{errors.course_id}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Inscrever
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminEnrollments({
    enrollments,
    students,
    courses,
}: {
    enrollments: Enrollment[];
    students: Option[];
    courses: Option[];
}) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredEnrollments = enrollments.filter(enrollment => (statusFilter === 'all' || enrollment.status === statusFilter) && `${enrollment.student} ${enrollment.student_email} ${enrollment.course}`.toLowerCase().includes(query.toLowerCase()));
    return (
        <div className="flex flex-col gap-4 p-4">
            <Head title="Inscrições" />
            <div className="flex items-center justify-between">
                <Heading title="Inscrições" description="Alunos inscritos e progresso por curso." />
                <NewEnrollmentDialog students={students} courses={courses} />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} className="pl-9" placeholder="Pesquisar aluno, e-mail ou curso…" /></div><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="all">Todos os estados</option><option value="active">Ativas</option><option value="pending">Pendentes</option><option value="completed">Concluídas</option><option value="cancelled">Canceladas</option></select></div>

            {filteredEnrollments.length === 0 ? (
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
                            {filteredEnrollments.map((e) => (
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
