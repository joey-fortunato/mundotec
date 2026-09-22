import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronLeft,
    FileText,
    PlayCircle,
} from 'lucide-react';

type Lesson = {
    id: number;
    title: string;
    type: string;
    duration_minutes: number | null;
    completed: boolean;
    current: boolean;
};

type Module = { id: number; title: string; lessons: Lesson[] };

type CurrentLesson = {
    id: number;
    title: string;
    type: string;
    type_label: string;
    content: string | null;
    video_url: string | null;
    completed: boolean;
    module_title: string;
} | null;

type Props = {
    course: { title: string; slug: string };
    progress: { percent: number; completed: number; total: number };
    modules: Module[];
    lesson: CurrentLesson;
    nextLessonId: number | null;
    prevLessonId: number | null;
};

export default function LearnShow({ course, progress, modules, lesson, nextLessonId, prevLessonId }: Props) {
    function goTo(id: number) {
        router.get(`/aprender/${course.slug}/aulas/${id}`);
    }

    function completeAndNext() {
        if (!lesson) {
return;
}

        router.post(`/aprender/${course.slug}/aulas/${lesson.id}/concluir`);
    }

    return (
        <div className="flex h-screen flex-col bg-background text-foreground">
            <Head title={lesson ? lesson.title : course.title} />

            <header className="flex h-[52px] flex-none items-center justify-between bg-[#0B1220] px-5 py-3 text-white">
                <Link href="/os-meus-cursos" className="flex items-center gap-3 text-sm">
                    <ChevronLeft className="h-4 w-4 text-white/60" />
                    <span className="font-semibold">{course.title}</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">{progress.percent}%</span>
                        <div className="h-1.5 w-28 rounded-full bg-white/15">
                            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${progress.percent}%` }} />
                        </div>
                    </div>
                    <span className="text-sm text-white/80">
                        {progress.completed} / {progress.total} aulas
                    </span>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex h-[52%] flex-none items-center justify-center bg-[#0F172A]">
                        {lesson?.type === 'video' && lesson.video_url ? (
                            <iframe
                                src={lesson.video_url}
                                title={lesson.title}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-white/50">
                                {lesson?.type === 'text' ? (
                                    <FileText className="h-10 w-10" />
                                ) : (
                                    <PlayCircle className="h-12 w-12" />
                                )}
                                <span className="text-sm">{lesson ? lesson.type_label : 'Sem aula'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto p-6">
                        {lesson ? (
                            <>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground">{lesson.module_title}</div>
                                        <h1 className="mt-0.5 text-xl font-bold">{lesson.title}</h1>
                                    </div>
                                    <div className="flex flex-none gap-2">
                                        {prevLessonId && (
                                            <button
                                                onClick={() => goTo(prevLessonId)}
                                                className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-muted-foreground"
                                            >
                                                <ArrowLeft className="h-4 w-4" /> Anterior
                                            </button>
                                        )}
                                        <button
                                            onClick={completeAndNext}
                                            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                                        >
                                            {lesson.completed ? 'Concluída' : 'Marcar concluída'}
                                            {nextLessonId ? <ArrowRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {lesson.content && (
                                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                                        {lesson.content}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-muted-foreground">Este curso ainda não tem aulas.</p>
                        )}
                    </div>
                </div>

                <aside className="flex w-80 flex-none flex-col border-l bg-card">
                    <div className="border-b p-4">
                        <h2 className="text-sm font-semibold">Conteúdo do curso</h2>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                            {progress.completed} de {progress.total} concluídas
                        </div>
                    </div>
                    <div className="overflow-auto">
                        {modules.map((module) => (
                            <div key={module.id}>
                                <div className="flex items-center justify-between bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                                    <span className="truncate">{module.title}</span>
                                    <span>
                                        {module.lessons.filter((l) => l.completed).length}/{module.lessons.length}
                                    </span>
                                </div>
                                {module.lessons.map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => goTo(l.id)}
                                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${l.current ? 'bg-accent font-semibold text-accent-foreground' : 'text-foreground hover:bg-muted/40'}`}
                                    >
                                        {l.completed ? (
                                            <CheckCircle2 className="h-4 w-4 flex-none text-green-600" />
                                        ) : (
                                            <PlayCircle className={`h-4 w-4 flex-none ${l.current ? 'text-primary' : 'text-muted-foreground'}`} />
                                        )}
                                        <span className="flex-1 truncate">{l.title}</span>
                                        {l.duration_minutes && (
                                            <span className="text-xs text-muted-foreground">{l.duration_minutes}m</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
