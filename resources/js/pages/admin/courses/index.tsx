import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type CourseRow = {
    id: number;
    title: string;
    slug: string;
    price: string;
    currency: string;
    status: string;
    status_label: string;
    category: string | null;
    modules_count: number;
    enrollments_count: number;
};

function money(value: string, currency: string) {
    const n = Number(value);

    return `${n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    archived: 'outline',
};

export default function CoursesIndex({ courses }: { courses: CourseRow[] }) {
    function remove(course: CourseRow) {
        if (
            confirm(
                `Remover o curso "${course.title}"? Esta ação não pode ser desfeita.`,
            )
        ) {
            router.delete(`/admin/courses/${course.slug}`);
        }
    }

    return (
        <>
            <Head title="Cursos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Cursos"
                        description="Gere o catálogo de cursos da plataforma."
                    />
                    <Button asChild>
                        <Link href="/admin/courses/create">
                            <Plus className="mr-2 h-4 w-4" /> Novo curso
                        </Link>
                    </Button>
                </div>

                {courses.length === 0 ? (
                    <Card className="flex flex-col items-center gap-3 p-10 text-center">
                        <p className="text-muted-foreground">
                            Ainda não há cursos.
                        </p>
                        <Button asChild>
                            <Link href="/admin/courses/create">
                                <Plus className="mr-2 h-4 w-4" /> Criar o
                                primeiro curso
                            </Link>
                        </Button>
                    </Card>
                ) : (
                    <Card className="overflow-x-auto p-0">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Curso
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Categoria
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Preço
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Módulos
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Alunos
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="border-b last:border-0 hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/courses/${course.slug}`}
                                                className="font-medium hover:underline"
                                            >
                                                {course.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {course.category ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {money(
                                                course.price,
                                                course.currency,
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    statusVariant[
                                                        course.status
                                                    ] ?? 'secondary'
                                                }
                                            >
                                                {course.status_label}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {course.modules_count}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {course.enrollments_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Link
                                                        href={`/admin/courses/${course.slug}`}
                                                        aria-label="Editar"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        remove(course)
                                                    }
                                                    aria-label="Remover"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}
            </div>
        </>
    );
}

CoursesIndex.layout = {
    breadcrumbs: [{ title: 'Cursos', href: '/admin/courses' }],
};
