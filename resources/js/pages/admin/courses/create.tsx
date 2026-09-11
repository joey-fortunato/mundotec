import { Head } from '@inertiajs/react';
import {
    CourseForm
    
} from '@/components/admin/course-form';
import type {CourseFormOptions} from '@/components/admin/course-form';
import Heading from '@/components/heading';

export default function CreateCourse({
    options,
}: {
    options: CourseFormOptions;
}) {
    return (
        <>
            <Head title="Novo curso" />
            <div className="mx-auto w-full max-w-3xl p-4">
                <Heading
                    title="Novo curso"
                    description="Cria um curso. Podes adicionar módulos e aulas a seguir."
                />
                <CourseForm
                    options={options}
                    submitUrl="/admin/courses"
                    method="post"
                    submitLabel="Criar curso"
                />
            </div>
        </>
    );
}

CreateCourse.layout = {
    breadcrumbs: [
        { title: 'Cursos', href: '/admin/courses' },
        { title: 'Novo', href: '/admin/courses/create' },
    ],
};
