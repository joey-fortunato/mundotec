import { Head, Link } from '@inertiajs/react';
import {
    Award,
    BadgeCheck,
    BookOpenCheck,
    Compass,
    FileSpreadsheet,
    GraduationCap,
    Megaphone,
    Network,
    ShieldCheck,
    Star,
    Users
    
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import { CourseCard  } from '@/components/course-card';
import type {CourseCardData} from '@/components/course-card';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Category = { name: string; slug: string; description: string | null; courses_count: number };
type Stats = { graduates: number; internships: number; courses: number };

const CATEGORY_ICON: Record<string, LucideIcon> = {
    tecnologia: Network,
    'marketing-design-grafico': Megaphone,
    'marketing-e-design': Megaphone,
    'marketing-digital-design-grafico': Megaphone,
    administrativos: FileSpreadsheet,
};

const PARTNERS = ['INEFOP', 'Cisco', 'Primavera BSS', 'Microsoft'];

const STEPS = [
    [Compass, 'Escolhe um curso', 'Explora o catálogo e encontra a formação certa para os teus objetivos.'],
    [BookOpenCheck, 'Aprende ao teu ritmo', 'Aulas em vídeo, exercícios e projetos reais, com acompanhamento.'],
    [Award, 'Recebe o certificado', 'Conclui o curso e recebe um certificado reconhecido pelo INEFOP.'],
] as const;

const INSTRUCTORS = [
    ['Paulo Neves', 'Engenheiro de Redes · CCNP', 'PN'],
    ['Sara Dias', 'Programadora Full-Stack', 'SD'],
    ['Júlia Costa', 'Especialista em Marketing', 'JC'],
] as const;

const TESTIMONIALS = [
    ['O curso de redes mudou a minha carreira. Em três meses já estava a trabalhar na área.', 'João Neto', 'Técnico de Redes · CCNA', 'JN'],
    ['Aprendi a criar sites do zero e hoje trabalho como freelancer.', 'Ana Kiala', 'Programadora Web', 'AK'],
] as const;

export default function Home({ featured, categories, stats }: { featured: CourseCardData[]; categories: Category[]; stats: Stats }) {
    return (
        <PublicLayout>
            <Head title="Formação profissional certificada" />

            <section className="grid items-center gap-8 py-10 md:grid-cols-2">
                <div>
                    <Badge variant="secondary" className="gap-1.5">
                        <Award className="h-3.5 w-3.5" /> Certificação reconhecida pelo INEFOP
                    </Badge>
                    <h1 className="mt-4 text-4xl leading-[1.08] font-bold tracking-tight md:text-5xl">
                        Eleva a tua carreira com formação prática
                    </h1>
                    <p className="mt-4 max-w-md text-lg text-muted-foreground">
                        Cursos profissionais de tecnologia, marketing e gestão — com certificado, projetos reais e
                        acompanhamento de formadores.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/cursos">Explorar cursos</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/register">Criar conta grátis</Link>
                        </Button>
                    </div>
                    <div className="mt-8 flex gap-8">
                        <div>
                            <div className="text-2xl font-bold">+{stats.graduates}</div>
                            <div className="text-xs text-muted-foreground">graduados</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">+{stats.internships}</div>
                            <div className="text-xs text-muted-foreground">estágios</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-2xl font-bold">
                                4.9 <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            </div>
                            <div className="text-xs text-muted-foreground">avaliação média</div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <Card className="rotate-[-2deg] overflow-hidden p-0">
                        <div className="flex h-32 items-center justify-center bg-primary">
                            <Network className="h-14 w-14 text-primary-foreground/70" strokeWidth={1.3} />
                        </div>
                        <div className="p-5">
                            <div className="font-semibold">Cisco CCNA — Redes</div>
                            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                                <span>24 aulas · 20h</span>
                                <span className="font-bold text-foreground">90 000 AOA</span>
                            </div>
                        </div>
                    </Card>
                    <Card className="absolute -bottom-4 left-2 flex items-center gap-2.5 p-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                            <BadgeCheck className="h-5 w-5 text-green-600" />
                        </span>
                        <div>
                            <div className="text-sm font-semibold">Certificado emitido</div>
                            <div className="text-xs text-muted-foreground">há 2 minutos</div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="flex flex-wrap items-center justify-between gap-4 border-y py-5 text-sm font-semibold text-muted-foreground">
                <span className="text-xs tracking-wide">PARCEIROS &amp; RECONHECIMENTO</span>
                <div className="flex flex-wrap items-center gap-8">
                    {PARTNERS.map((p) => (
                        <span key={p} className="text-foreground/70">
                            {p}
                        </span>
                    ))}
                </div>
            </section>

            <section className="py-12">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Áreas de formação</h2>
                    <p className="mt-2 text-muted-foreground">Escolhe o teu caminho e começa hoje.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((c) => {
                        const Icon = CATEGORY_ICON[c.slug] ?? GraduationCap;

                        return (
                            <Link key={c.slug} href={`/cursos?categoria=${c.slug}`} className="group">
                                <Card className="h-full transition-shadow group-hover:shadow-md">
                                    <CardContent className="pt-6">
                                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-semibold">{c.name}</h3>
                                        {c.description && (
                                            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                                        )}
                                        <span className="mt-3 inline-block text-sm font-semibold text-primary">
                                            {c.courses_count} curso(s) →
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {featured.length > 0 && (
                <section className="py-6">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Cursos em destaque</h2>
                            <p className="mt-1 text-muted-foreground">Os mais procurados este mês.</p>
                        </div>
                        <Link href="/cursos" className="text-sm font-semibold text-primary">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map((course) => (
                            <CourseCard key={course.slug} course={course} />
                        ))}
                    </div>
                </section>
            )}

            <section className="py-12">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Como funciona</h2>
                    <p className="mt-2 text-muted-foreground">Três passos até ao teu certificado.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    {STEPS.map(([Icon, title, desc], i) => (
                        <Card key={title}>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="text-3xl font-bold text-primary/20">{i + 1}</span>
                                </div>
                                <h3 className="font-semibold">{title}</h3>
                                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="grid items-center gap-10 py-6 md:grid-cols-2">
                <div>
                    <h2 className="text-2xl font-bold">Porquê a Mundo da Tecnologia?</h2>
                    <div className="mt-6 flex flex-col gap-5">
                        {[
                            [Award, 'Certificado INEFOP', 'Reconhecido no mercado de trabalho angolano.'],
                            [ShieldCheck, 'Projetos reais', 'Aprende a fazer, não só a assistir.'],
                            [Users, 'Estágios e emprego', 'Ligação a empresas e programa de estágios.'],
                        ].map(([Icon, title, desc]) => {
                            const I = Icon as LucideIcon;

                            return (
                                <div key={title as string} className="flex gap-3.5">
                                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <I className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{title as string}</div>
                                        <div className="text-sm text-muted-foreground">{desc as string}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="grid gap-4">
                    {TESTIMONIALS.map(([quote, name, role, ini]) => (
                        <Card key={name} className="bg-primary/5">
                            <CardContent className="pt-6">
                                <p className="leading-relaxed">"{quote}"</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                        {ini}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">{name}</div>
                                        <div className="text-xs text-muted-foreground">{role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="py-12">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Formadores</h2>
                    <p className="mt-2 text-muted-foreground">Profissionais com experiência real no terreno.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    {INSTRUCTORS.map(([name, role, ini]) => (
                        <Card key={name}>
                            <CardContent className="flex items-center gap-3 pt-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                                    {ini}
                                </div>
                                <div>
                                    <div className="font-semibold">{name}</div>
                                    <div className="text-xs text-muted-foreground">{role}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="my-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary p-8 text-primary-foreground sm:flex-row">
                <div>
                    <h2 className="text-2xl font-bold text-primary-foreground">Pronto para começar?</h2>
                    <p className="mt-1 opacity-85">Inscreve-te num curso e recebe o teu certificado.</p>
                </div>
                <Button asChild size="lg" variant="secondary">
                    <Link href="/register">Criar conta grátis</Link>
                </Button>
            </section>
        </PublicLayout>
    );
}
