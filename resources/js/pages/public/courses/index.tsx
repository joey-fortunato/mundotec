import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CourseCard  } from '@/components/course-card';
import type {CourseCardData} from '@/components/course-card';
import PublicLayout from '@/layouts/public-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type CategoryChip = { name: string; slug: string };

export default function CatalogIndex({
    courses,
    categories,
    activeCategory,
}: {
    courses: CourseCardData[];
    categories: CategoryChip[];
    activeCategory: string | null;
}) {
    const [query, setQuery] = useState('');
    const filteredCourses = useMemo(() => courses.filter(course => `${course.title} ${course.subtitle ?? ''} ${course.category ?? ''}`.toLowerCase().includes(query.toLowerCase())), [courses, query]);
    return (
        <PublicLayout>
            <Head title="Cursos" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Os nossos cursos</h1>
                <p className="mt-2 text-muted-foreground">
                    Formação profissional certificada. Escolhe uma área e começa a evoluir.
                </p>
            </div>

            <div className="relative mb-6 max-w-xl"><Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-11 rounded-xl pl-10 shadow-sm" value={query} onChange={event => setQuery(event.target.value)} placeholder="Que competência queres aprender?" /></div>

            {categories.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    <Link
                        href="/cursos"
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium ${!activeCategory ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                        Todas
                    </Link>
                    {categories.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/cursos?categoria=${c.slug}`}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${activeCategory === c.slug ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            )}

            {filteredCourses.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground">
                    Ainda não há cursos publicados nesta área.
                </Card>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.slug} course={course} />
                    ))}
                </div>
            )}
        </PublicLayout>
    );
}
