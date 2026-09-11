import { Head } from '@inertiajs/react';
import {
    CourseForm
    
    
} from '@/components/admin/course-form';
import type {CourseFormOptions, CourseFormValues} from '@/components/admin/course-form';
import Heading from '@/components/heading';

type EditCourse = {
    id: number;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    category_id: number | null;
    instructor_id: number | null;
    price: string;
    max_installments: number;
    level: string | null;
    duration_minutes: number | null;
    status: string;
};

function toFormValues(course: EditCourse): Partial<CourseFormValues> {
    return {
        title: course.title,
        subtitle: course.subtitle ?? '',
        description: course.description ?? '',
        category_id: course.category_id ? String(course.category_id) : '',
        instructor_id: course.instructor_id ? String(course.instructor_id) : '',
        price: String(course.price),
        max_installments: String(course.max_installments),
        level: course.level ?? '',
        duration_minutes: course.duration_minutes
            ? String(course.duration_minutes)
            : '',
        status: course.status,
    };
}

export default function EditCoursePage({
    course,
    options,
}: {
    course: EditCourse;
    options: CourseFormOptions;
}) {
    return (
        <>
            <Head title={`Editar: ${course.title}`} />
            <div className="mx-auto w-full max-w-3xl p-4">
                <Heading title="Editar curso" description={course.title} />
                <CourseForm
                    options={options}
                    initial={toFormValues(course)}
                    submitUrl={`/admin/courses/${course.slug}`}
                    method="put"
                    submitLabel="Guardar alterações"
                />
            </div>
        </>
    );
}

EditCoursePage.layout = {
    breadcrumbs: [
        { title: 'Cursos', href: '/admin/courses' },
        { title: 'Editar', href: '#' },
    ],
};
