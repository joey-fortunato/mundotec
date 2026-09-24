import { Head, Link } from '@inertiajs/react';
import { BookOpen, CheckCircle2, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Props = { stats: { courses: number; active_students: number; completed_students: number }; courses: { title: string; slug: string; enrollments: number; modules: number }[] };

export default function InstructorDashboard({ stats, courses }: Props) {
    const cards = [[BookOpen, 'Cursos atribuídos', stats.courses], [Users, 'Alunos ativos', stats.active_students], [CheckCircle2, 'Conclusões', stats.completed_students]] as const;
    return <div className="flex flex-col gap-6 p-4"><Head title="Painel do instrutor" /><div><h1 className="text-2xl font-bold">Painel do instrutor</h1><p className="mt-1 text-muted-foreground">Acompanha os cursos e os alunos sob a tua orientação.</p></div><div className="grid gap-4 sm:grid-cols-3">{cards.map(([Icon, label, value]) => <Card key={label}><CardContent className="pt-6"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4 text-primary" />{label}</div><div className="mt-2 text-3xl font-bold">{value}</div></CardContent></Card>)}</div><Card><CardContent className="pt-6"><h2 className="font-semibold">Os teus cursos</h2><div className="mt-4 divide-y">{courses.map(course => <div key={course.slug} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-medium">{course.title}</div><div className="mt-1 text-sm text-muted-foreground">{course.enrollments} aluno(s) · {course.modules} módulo(s)</div></div><Button asChild variant="outline" size="sm"><Link href={`/instrutor/cursos/${course.slug}`}>Ver currículo</Link></Button></div>)}{courses.length === 0 && <p className="py-4 text-sm text-muted-foreground">Ainda não tens cursos atribuídos.</p>}</div></CardContent></Card></div>;
}

InstructorDashboard.layout = { breadcrumbs: [{ title: 'Painel do instrutor', href: '/instrutor' }] };
