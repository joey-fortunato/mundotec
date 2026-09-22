import { Head } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';

type Instructor = { name: string; email: string; courses: number };

function initials(name: string) {
    return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

export default function AdminInstructors({ instructors }: { instructors: Instructor[] }) {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Head title="Instrutores" />
            <Heading title="Instrutores" description="Formadores responsáveis pelos cursos." />

            {instructors.length === 0 ? (
                <Card className="flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
                    <GraduationCap className="h-8 w-8" />
                    Ainda não há instrutores.
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {instructors.map((i) => (
                        <Card key={i.email}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                                        {initials(i.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate font-semibold">{i.name}</div>
                                        <div className="truncate text-xs text-muted-foreground">{i.email}</div>
                                    </div>
                                </div>
                                <div className="mt-4 border-t pt-3 text-sm text-muted-foreground">
                                    {i.courses} curso(s)
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

AdminInstructors.layout = {
    breadcrumbs: [{ title: 'Instrutores', href: '/admin/instrutores' }],
};
