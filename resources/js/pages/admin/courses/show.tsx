import { Head, Link, router } from '@inertiajs/react';
import { FileText, Film, Pencil, Trash2, Video } from 'lucide-react';
import { AddLessonDialog } from '@/components/admin/lesson-dialog';
import { AddModuleDialog } from '@/components/admin/module-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Lesson = {
    id: number;
    title: string;
    type: string;
    type_label: string;
    position: number;
    is_preview: boolean;
};

type Module = {
    id: number;
    title: string;
    position: number;
    lessons: Lesson[];
};

type Course = {
    id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    status: string;
    status_label: string;
    price: string;
    currency: string;
    category: string | null;
    instructor: string | null;
    modules: Module[];
};

const lessonIcon: Record<string, typeof Video> = {
    video: Video,
    text: FileText,
    pdf: Film,
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    archived: 'outline',
};

export default function CourseShow({ course }: { course: Course }) {
    function removeModule(module: Module) {
        if (
            confirm(`Remover o módulo "${module.title}" e todas as suas aulas?`)
        ) {
            router.delete(
                `/admin/courses/${course.slug}/modules/${module.id}`,
                { preserveScroll: true },
            );
        }
    }

    function removeLesson(module: Module, lesson: Lesson) {
        if (confirm(`Remover a aula "${lesson.title}"?`)) {
            router.delete(
                `/admin/courses/${course.slug}/modules/${module.id}/lessons/${lesson.id}`,
                { preserveScroll: true },
            );
        }
    }

    const money = `${Number(course.price).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} ${course.currency}`;

    return (
        <>
            <Head title={course.title} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <Heading
                                title={course.title}
                                description={course.subtitle ?? undefined}
                            />
                            <Badge
                                variant={
                                    statusVariant[course.status] ?? 'secondary'
                                }
                            >
                                {course.status_label}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {money}
                            {course.category ? ` · ${course.category}` : ''}
                            {course.instructor ? ` · ${course.instructor}` : ''}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/admin/courses/${course.slug}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar curso
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Currículo</h3>
                    <AddModuleDialog courseSlug={course.slug} />
                </div>

                {course.modules.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">
                        Ainda não há módulos. Adiciona o primeiro para começar a
                        estruturar o curso.
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {course.modules.map((module, index) => (
                            <Card key={module.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-base">
                                        <span className="text-muted-foreground">
                                            Módulo {index + 1}:
                                        </span>{' '}
                                        {module.title}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeModule(module)}
                                        aria-label="Remover módulo"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-1">
                                    {module.lessons.length === 0 ? (
                                        <p className="px-1 py-2 text-sm text-muted-foreground">
                                            Sem aulas neste módulo.
                                        </p>
                                    ) : (
                                        module.lessons.map((lesson) => {
                                            const Icon =
                                                lessonIcon[lesson.type] ??
                                                Video;

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/40"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {lesson.title}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {lesson.type_label}
                                                        </Badge>
                                                        {lesson.is_preview && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                Prévia
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeLesson(
                                                                module,
                                                                lesson,
                                                            )
                                                        }
                                                        aria-label="Remover aula"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div className="pt-1">
                                        <AddLessonDialog
                                            courseSlug={course.slug}
                                            moduleId={module.id}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

CourseShow.layout = {
    breadcrumbs: [{ title: 'Cursos', href: '/admin/courses' }],
};
