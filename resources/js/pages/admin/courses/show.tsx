import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, FileText, Film, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import { CourseForm } from '@/components/admin/course-form';
import type { CourseFormOptions, CourseFormValues } from '@/components/admin/course-form';
import { AddLessonDialog } from '@/components/admin/lesson-dialog';
import { AddModuleDialog } from '@/components/admin/module-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Lesson = { id: number; title: string; type: string; type_label: string; position: number; is_preview: boolean };
type Module = { id: number; title: string; position: number; lessons: Lesson[] };

type Course = {
    id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    category: string | null;
    category_id: number | null;
    instructor: string | null;
    instructor_id: number | null;
    status: string;
    status_label: string;
    price: string;
    currency: string;
    max_installments: number;
    level: string | null;
    duration_minutes: number | null;
    cover: string | null;
    modules: Module[];
};

const lessonIcon: Record<string, typeof Video> = { video: Video, text: FileText, pdf: Film };
const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    archived: 'outline',
};

function toFormValues(course: Course): Partial<CourseFormValues> {
    return {
        title: course.title,
        subtitle: course.subtitle ?? '',
        description: course.description ?? '',
        category_id: course.category_id ? String(course.category_id) : '',
        instructor_id: course.instructor_id ? String(course.instructor_id) : '',
        price: String(course.price),
        max_installments: String(course.max_installments),
        level: course.level ?? '',
        duration_minutes: course.duration_minutes ? String(course.duration_minutes) : '',
        status: course.status,
    };
}

export default function CourseShow({ course, options }: { course: Course; options: CourseFormOptions }) {
    const [tab, setTab] = useState<'detalhes' | 'curriculo'>('curriculo');

    function removeModule(module: Module) {
        if (confirm(`Remover o módulo "${module.title}" e todas as suas aulas?`)) {
            router.delete(`/admin/courses/${course.slug}/modules/${module.id}`, { preserveScroll: true });
        }
    }

    function removeLesson(module: Module, lesson: Lesson) {
        if (confirm(`Remover a aula "${lesson.title}"?`)) {
            router.delete(`/admin/courses/${course.slug}/modules/${module.id}/lessons/${lesson.id}`, { preserveScroll: true });
        }
    }

    const money = `${Number(course.price).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} ${course.currency}`;

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4">
            <Head title={course.title} />

            <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" /> Cursos
            </Link>

            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
                <Badge variant={statusVariant[course.status] ?? 'secondary'}>{course.status_label}</Badge>
                <span className="text-sm text-muted-foreground">
                    {money}
                    {course.category ? ` · ${course.category}` : ''}
                    {course.instructor ? ` · ${course.instructor}` : ''}
                </span>
            </div>

            <div className="flex gap-1 rounded-lg border bg-card p-1">
                {(['detalhes', 'curriculo'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            tab === t ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {t === 'detalhes' ? 'Detalhes do curso' : 'Currículo'}
                    </button>
                ))}
            </div>

            {tab === 'detalhes' ? (
                <CourseForm
                    options={options}
                    initial={toFormValues(course)}
                    initialCover={course.cover}
                    submitUrl={`/admin/courses/${course.slug}`}
                    method="put"
                    submitLabel="Guardar alterações"
                />
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Currículo</h3>
                        <AddModuleDialog courseSlug={course.slug} />
                    </div>

                    {course.modules.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            Ainda não há módulos. Adiciona o primeiro para começar a estruturar o curso.
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {course.modules.map((module, index) => (
                                <Card key={module.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base">
                                            <span className="text-muted-foreground">Módulo {index + 1}:</span> {module.title}
                                        </CardTitle>
                                        <Button variant="ghost" size="icon" onClick={() => removeModule(module)} aria-label="Remover módulo">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-1">
                                        {module.lessons.length === 0 ? (
                                            <p className="px-1 py-2 text-sm text-muted-foreground">Sem aulas neste módulo.</p>
                                        ) : (
                                            module.lessons.map((lesson) => {
                                                const Icon = lessonIcon[lesson.type] ?? Video;

                                                return (
                                                    <div key={lesson.id} className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/40">
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{lesson.title}</span>
                                                            <Badge variant="outline" className="text-xs">{lesson.type_label}</Badge>
                                                            {lesson.is_preview && <Badge variant="secondary" className="text-xs">Prévia</Badge>}
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => removeLesson(module, lesson)} aria-label="Remover aula">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div className="pt-1">
                                            <AddLessonDialog courseSlug={course.slug} moduleId={module.id} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

CourseShow.layout = {
    breadcrumbs: [{ title: 'Cursos', href: '/admin/courses' }],
};
