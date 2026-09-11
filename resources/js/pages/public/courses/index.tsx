import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CourseCard = {
    title: string;
    slug: string;
    subtitle: string | null;
    price: string;
    currency: string;
    level: string | null;
    category: string | null;
};

type CategoryChip = { name: string; slug: string };

function money(value: string, currency: string) {
    return `${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function CatalogIndex({
    courses,
    categories,
    activeCategory,
}: {
    courses: CourseCard[];
    categories: CategoryChip[];
    activeCategory: string | null;
}) {
    return (
        <PublicLayout>
            <Head title="Cursos" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Os nossos cursos</h1>
                <p className="mt-2 text-muted-foreground">
                    Formação profissional certificada. Escolhe uma área e começa a evoluir.
                </p>
            </div>

            {categories.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    <Link
                        href="/cursos"
                        className={`rounded-full border px-3 py-1 text-sm ${!activeCategory ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                    >
                        Todas
                    </Link>
                    {categories.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/cursos?categoria=${c.slug}`}
                            className={`rounded-full border px-3 py-1 text-sm ${activeCategory === c.slug ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            )}

            {courses.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground">
                    Ainda não há cursos publicados nesta área.
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Link key={course.slug} href={`/cursos/${course.slug}`} className="group">
                            <Card className="h-full transition-shadow group-hover:shadow-md">
                                <CardHeader>
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        {course.category && <Badge variant="secondary">{course.category}</Badge>}
                                        {course.level && <Badge variant="outline">{course.level}</Badge>}
                                    </div>
                                    <CardTitle className="text-lg leading-snug">{course.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex h-full flex-col justify-between gap-4">
                                    {course.subtitle && (
                                        <p className="line-clamp-3 text-sm text-muted-foreground">{course.subtitle}</p>
                                    )}
                                    <p className="text-base font-semibold">{money(course.price, course.currency)}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </PublicLayout>
    );
}
