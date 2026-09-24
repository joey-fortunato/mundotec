import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Course = { title: string; modules: { title: string; lessons: { title: string; type: string }[] }[] };

export default function InstructorCourse({ course }: { course: Course }) {
    return <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4"><Head title={course.title} /><Link href="/instrutor" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" />Painel do instrutor</Link><div><h1 className="text-2xl font-bold">{course.title}</h1><p className="mt-1 text-muted-foreground">Currículo do curso atribuído.</p></div><div className="flex flex-col gap-4">{course.modules.map((module, i) => <Card key={module.title}><CardContent className="pt-5"><h2 className="font-semibold">Módulo {i + 1}: {module.title}</h2><div className="mt-3 divide-y">{module.lessons.map(lesson => <div key={lesson.title} className="flex items-center gap-3 py-2.5 text-sm"><FileText className="h-4 w-4 text-primary" /><span>{lesson.title}</span><span className="ml-auto text-xs text-muted-foreground">{lesson.type}</span></div>)}{module.lessons.length === 0 && <p className="py-2 text-sm text-muted-foreground">Sem aulas.</p>}</div></CardContent></Card>)}</div></div>;
}

InstructorCourse.layout = { breadcrumbs: [{ title: 'Painel do instrutor', href: '/instrutor' }] };
