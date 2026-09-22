import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Clock,
    FileSpreadsheet,
    Laptop,
    Megaphone,
    Network,
    PlayCircle
    
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export type CourseCardData = {
    title: string;
    slug: string;
    subtitle?: string | null;
    price: string;
    currency: string;
    level?: string | null;
    category?: string | null;
    category_slug?: string | null;
    instructor?: string | null;
    lessons_count?: number;
    duration_minutes?: number | null;
    rating?: number | null;
    ratings_count?: number | null;
};

const CATEGORY_ICON: Record<string, LucideIcon> = {
    tecnologia: Network,
    'marketing-design-grafico': Megaphone,
    'marketing-e-design': Megaphone,
    'marketing-digital-design-grafico': Megaphone,
    administrativos: FileSpreadsheet,
};

function money(value: string, currency: string) {
    return `${Number(value).toLocaleString('pt-PT', { maximumFractionDigits: 0 })} ${currency}`;
}

function initials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');
}

function hours(minutes?: number | null) {
    if (!minutes) {
return null;
}

    return minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes}m`;
}

export function CourseCard({ course }: { course: CourseCardData }) {
    const Icon = (course.category_slug && CATEGORY_ICON[course.category_slug]) || Laptop;
    const duration = hours(course.duration_minutes);

    return (
        <Link href={`/cursos/${course.slug}`} className="group block h-full">
            <Card className="flex h-full flex-col overflow-hidden pt-0 transition-shadow group-hover:shadow-md">
                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/70">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                            backgroundSize: '16px 16px',
                        }}
                    />
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                        <Icon className="h-8 w-8 text-white" strokeWidth={1.6} />
                    </span>
                    {course.category && (
                        <Badge className="absolute top-3 left-3 border-transparent bg-white/90 text-primary hover:bg-white">
                            {course.category}
                        </Badge>
                    )}
                    {course.level && (
                        <Badge className="absolute top-3 right-3 border-transparent bg-black/20 text-white hover:bg-black/20">
                            {course.level}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-1 flex-col px-4 pb-4">
                    <h3 className="leading-snug font-semibold">{course.title}</h3>
                    {course.subtitle && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.subtitle}</p>
                    )}

                    {course.instructor && (
                        <div className="mt-3 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                {initials(course.instructor)}
                            </span>
                            <span className="text-xs text-muted-foreground">{course.instructor}</span>
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
                        {typeof course.lessons_count === 'number' && (
                            <span className="flex items-center gap-1.5">
                                <PlayCircle className="h-3.5 w-3.5" /> {course.lessons_count} aulas
                            </span>
                        )}
                        {duration && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> {duration}
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                        <span className="font-bold">{money(course.price, course.currency)}</span>
                        <span className="flex items-center gap-1.5 rounded-lg bg-primary/8 px-3 py-1.5 text-sm font-semibold text-primary">
                            Ver curso <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
