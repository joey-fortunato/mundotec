import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    ChevronLeft,
    Clock,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    Infinity as InfinityIcon,
    Megaphone,
    Network,
    PlayCircle,
    Users
    
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Lesson = { title: string; type_label: string; duration_minutes: number | null; is_preview: boolean };
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
    category_slug: string | null;
    instructor: string | null;
    lessons_count: number;
    cover: string | null;
    modules: Module[];
};

const CATEGORY_ICON: Record<string, LucideIcon> = {
    tecnologia: Network,
    'marketing-design-grafico': Megaphone,
    administrativos: FileSpreadsheet,
};

function money(value: string, currency: string, decimals = 2) {
    return `${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${currency}`;
}

function initials(name: string) {
    return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

export default function CatalogShow({ course }: { course: Course }) {
    const { auth } = usePage().props;
    const enrollHref = auth.user ? `/cursos/${course.slug}/inscrever` : '/login';
    const Icon = (course.category_slug && CATEGORY_ICON[course.category_slug]) || Network;
    const hours = course.duration_minutes ? Math.round(course.duration_minutes / 60) : null;
    const installmentNote =
        course.max_installments > 1
            ? `Até ${course.max_installments}x de ${money((Number(course.price) / course.max_installments).toFixed(2), course.currency)}`
            : null;

    return (
        <PublicLayout>
            <Head title={course.title} />

            <Link href="/cursos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" /> Voltar aos cursos
            </Link>

            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
                <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        {course.category && <Badge className="bg-primary/15 text-primary hover:bg-primary/15">{course.category}</Badge>}
                        {course.level && <Badge variant="outline">{course.level}</Badge>}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                    {course.subtitle && <p className="mt-2 text-lg text-muted-foreground">{course.subtitle}</p>}

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        {course.instructor && (
                            <span className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" /> {course.instructor}
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4" /> {course.lessons_count} aula(s)
                        </span>
                        {hours && (
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {hours}h de conteúdo
                            </span>
                        )}
                    </div>

                    <div className="relative mt-6 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-primary/8">
                        {course.cover ? (
                            <img src={course.cover} alt={course.title} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                            <Icon className="h-16 w-16 text-primary/25" strokeWidth={1.2} />
                        )}
                        <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-lg">
                            <PlayCircle className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    {course.description && (
                        <div className="mt-8">
                            <h2 className="mb-2 text-xl font-semibold">Sobre o curso</h2>
                            <p className="text-sm leading-7 whitespace-pre-line text-muted-foreground">{course.description}</p>
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="mb-3 text-xl font-semibold">Conteúdo programático</h2>
                        {course.modules.length === 0 ? (
                            <p className="text-muted-foreground">O conteúdo será divulgado em breve.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {course.modules.map((module, i) => (
                                    <Card key={i} className="overflow-hidden py-0">
                                        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                                            <div className="font-semibold">
                                                <span className="text-muted-foreground">Módulo {i + 1}:</span> {module.title}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{module.lessons.length} aula(s)</span>
                                        </div>
                                        <div className="flex flex-col">
                                            {module.lessons.map((lesson, j) => {
                                                const LIcon = lesson.type_label === 'Texto' ? FileText : PlayCircle;

                                                return (
                                                    <div key={j} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                                        <span className="flex items-center gap-2.5">
                                                            <LIcon className="h-4 w-4 text-muted-foreground" />
                                                            {lesson.title}
                                                            {lesson.is_preview && (
                                                                <Badge variant="secondary" className="text-[10px]">
                                                                    Prévia grátis
                                                                </Badge>
                                                            )}
                                                        </span>
                                                        {lesson.duration_minutes && (
                                                            <span className="text-muted-foreground">{lesson.duration_minutes} min</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
                    <Card>
                        <CardContent className="flex flex-col gap-4 pt-6">
                            <div>
                                <p className="text-3xl font-bold">{money(course.price, course.currency)}</p>
                                {installmentNote && <p className="mt-1 text-sm text-muted-foreground">{installmentNote}</p>}
                            </div>
                            <Button asChild size="lg" className="w-full">
                                <Link href={enrollHref}>Inscrever-me</Link>
                            </Button>
                            <div className="flex flex-col gap-3 border-t pt-4 text-sm">
                                <span className="flex items-center gap-2.5">
                                    <Award className="h-4 w-4 text-primary" /> Certificado INEFOP
                                </span>
                                <span className="flex items-center gap-2.5">
                                    <InfinityIcon className="h-4 w-4 text-primary" /> Acesso vitalício
                                </span>
                                <span className="flex items-center gap-2.5">
                                    <Users className="h-4 w-4 text-primary" /> Acompanhamento do instrutor
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {course.instructor && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Instrutor</div>
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                        {initials(course.instructor)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">{course.instructor}</div>
                                        <div className="text-xs text-muted-foreground">Formador</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </aside>
            </div>
        </PublicLayout>
    );
}
