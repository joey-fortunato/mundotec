import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, GraduationCap, PlayCircle } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Lesson = {
    title: string;
    type_label: string;
    duration_minutes: number | null;
    is_preview: boolean;
};

type Module = { title: string; lessons: Lesson[] };

type Course = {
    title: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    price: string;
    currency: string;
    level: string | null;
    duration_minutes: number | null;
    max_installments: number;
    category: string | null;
    instructor: string | null;
    lessons_count: number;
    modules: Module[];
};

function money(value: string, currency: string) {
    return `${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function CatalogShow({ course }: { course: Course }) {
    const { auth } = usePage().props;
    const enrollHref = auth.user ? `/cursos/${course.slug}/inscrever` : '/login';
    const installmentNote =
        course.max_installments > 1
            ? `Até ${course.max_installments}x de ${money((Number(course.price) / course.max_installments).toFixed(2), course.currency)}`
            : null;

    return (
        <PublicLayout>
            <Head title={course.title} />

            <Link href="/cursos" className="text-sm text-muted-foreground hover:underline">
                ← Voltar aos cursos
            </Link>

            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
                <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        {course.category && <Badge variant="secondary">{course.category}</Badge>}
                        {course.level && <Badge variant="outline">{course.level}</Badge>}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                    {course.subtitle && <p className="mt-2 text-lg text-muted-foreground">{course.subtitle}</p>}

                    <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
                        {course.instructor && (
                            <span className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" /> {course.instructor}
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4" /> {course.lessons_count} aula(s)
                        </span>
                        {course.duration_minutes && (
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {Math.round(course.duration_minutes / 60)}h de conteúdo
                            </span>
                        )}
                    </div>

                    {course.description && (
                        <div className="mt-8">
                            <h2 className="mb-2 text-xl font-semibold">Sobre o curso</h2>
                            <p className="whitespace-pre-line text-muted-foreground">{course.description}</p>
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="mb-3 text-xl font-semibold">Conteúdo programático</h2>
                        {course.modules.length === 0 ? (
                            <p className="text-muted-foreground">O conteúdo será divulgado em breve.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {course.modules.map((module, i) => (
                                    <Card key={i}>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                <span className="text-muted-foreground">Módulo {i + 1}:</span> {module.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-2">
                                            {module.lessons.map((lesson, j) => (
                                                <div key={j} className="flex items-center justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                                        {lesson.title}
                                                        {lesson.is_preview && (
                                                            <Badge variant="secondary" className="text-xs">Prévia grátis</Badge>
                                                        )}
                                                    </span>
                                                    {lesson.duration_minutes && (
                                                        <span className="text-muted-foreground">{lesson.duration_minutes} min</span>
                                                    )}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="lg:sticky lg:top-8 lg:self-start">
                    <Card>
                        <CardContent className="flex flex-col gap-4 pt-6">
                            <div>
                                <p className="text-3xl font-bold">{money(course.price, course.currency)}</p>
                                {installmentNote && <p className="mt-1 text-sm text-muted-foreground">{installmentNote}</p>}
                            </div>
                            <Button asChild size="lg" className="w-full">
                                <Link href={enrollHref}>Inscrever-me</Link>
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                Certificação reconhecida pelo INEFOP
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </PublicLayout>
    );
}
