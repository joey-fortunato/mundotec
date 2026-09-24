import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { CourseCard } from '@/components/course-card';
import type { CourseCardData } from '@/components/course-card';
import { Button } from '@/components/ui/button';

export function CourseSlider({ title, description, courses }: { title: string; description?: string | null; courses: CourseCardData[] }) {
    const rail = useRef<HTMLDivElement>(null);
    const scroll = (direction: number) => rail.current?.scrollBy({ left: direction * Math.min(rail.current.clientWidth * .82, 860), behavior: 'smooth' });

    return <section className="py-7 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3">
        <div className="mb-5 flex items-end justify-between gap-3"><div><h2 className="text-2xl font-bold">{title}</h2>{description && <p className="mt-1 text-muted-foreground">{description}</p>}</div><div className="hidden gap-2 sm:flex"><Button type="button" variant="outline" size="icon" onClick={() => scroll(-1)} aria-label={`Cursos anteriores de ${title}`}><ChevronLeft className="h-4 w-4" /></Button><Button type="button" variant="outline" size="icon" onClick={() => scroll(1)} aria-label={`Próximos cursos de ${title}`}><ChevronRight className="h-4 w-4" /></Button></div></div>
        <div ref={rail} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:thin]">
            {courses.map(course => <div key={course.slug} className="w-[min(82vw,330px)] flex-none snap-start"><CourseCard course={course} /></div>)}
        </div>
    </section>;
}
