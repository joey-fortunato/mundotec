import { Head, Link } from '@inertiajs/react';
import {
    Award,
    BadgeCheck,
    ChevronDown,
    FileSpreadsheet,
    GraduationCap,
    Megaphone,
    Network,
    Star
    
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

const ELEVA = [
    ['+300', 'Graduados'],
    ['+1000', 'Estagiários'],
    ['+1000', 'Treinamentos'],
];

const TESTIMONIALS = [
    ['O curso de redes mudou a minha carreira. Em três meses já estava a trabalhar na área.', 'João Neto', 'Técnico de Redes · CCNA', 'JN'],
    ['Aprendi a criar sites do zero e hoje trabalho como freelancer.', 'Ana Kiala', 'Programadora Web', 'AK'],
    ['A formação em Primavera abriu-me portas no departamento financeiro.', 'Domingas Paulo', 'Assistente Administrativa', 'DP'],
];

const FAQ = [
    ['Os certificados são reconhecidos?', 'Sim. Os nossos cursos são certificados e reconhecidos pelo INEFOP, com valor no mercado de trabalho angolano.'],
    ['Como faço o pagamento?', 'O pagamento é feito por Multicaixa Express, podendo ser em prestações consoante o curso.'],
    ['As aulas são presenciais ou online?', 'Temos formação online na plataforma e turmas presenciais em Luanda e no Zango III.'],
    ['Recebo apoio para estágio?', 'Sim. Temos um programa de estágios com ligação a empresas parceiras.'],
];

export default function Home({ featured, categories, stats }: { featured: CourseCardData[]; categories: Category[]; stats: Stats }) {
    return (
        <PublicLayout>
            <Head title="Cursos Profissionais, Estágios e Treinamentos" />

            {/* Hero */}
            <section className="grid items-center gap-8 py-10 md:grid-cols-2">
                <div>
                    <Badge variant="secondary" className="gap-1.5">
                        <Award className="h-3.5 w-3.5" /> Certificados reconhecidos pelo INEFOP
                    </Badge>
                    <h1 className="mt-4 text-4xl leading-[1.08] font-bold tracking-tight md:text-5xl">
                        Cursos Profissionais, Estágios e Treinamentos
                    </h1>
                    <p className="mt-4 max-w-md text-lg text-muted-foreground">
                        Domine habilidades de alto impacto com cursos acessíveis e certificados que fazem a diferença na
                        sua carreira.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/cursos">Inicie a sua jornada</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/sobre">Sobre nós</Link>
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
                    <Card className="overflow-hidden p-0">
                        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/70">
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '18px 18px' }}
                            />
                            <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                                <GraduationCap className="h-10 w-10 text-white" />
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="font-semibold">Cisco CCNA — Redes</div>
                            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                                <span>24 aulas · 20h</span>
                                <span className="font-bold text-foreground">90 000 AOA</span>
                            </div>
                        </div>
                    </Card>
                    <Card className="absolute -top-3 -left-3 flex items-center gap-2.5 p-3 shadow-lg">
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

            {/* Categories */}
            <section className="py-12">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Explore todas as categorias</h2>
                    <p className="mt-2 text-muted-foreground">Escolhe a tua área e começa hoje.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((c) => {
                        const Icon = CATEGORY_ICON[c.slug] ?? GraduationCap;

                        return (
                            <Link key={c.slug} href={`/cursos?categoria=${c.slug}`} className="group">
                                <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
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

            {/* Recommended courses */}
            {featured.length > 0 && (
                <section className="py-6">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Cursos recomendados</h2>
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

            {/* Nós Elevamos Você */}
            <section className="my-12 rounded-2xl bg-primary px-6 py-12 text-primary-foreground">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-primary-foreground">Nós Elevamos Você</h2>
                    <p className="mt-2 opacity-85">Resultados que falam por si.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                    {ELEVA.map(([value, label]) => (
                        <div key={label} className="text-center">
                            <div className="text-4xl font-bold">{value}</div>
                            <div className="mt-1 opacity-85">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-6">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">O que os nossos formandos dizem</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {TESTIMONIALS.map(([quote, name, role, ini]) => (
                        <Card key={name}>
                            <CardContent className="pt-6">
                                <div className="mb-2 flex gap-0.5 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed">"{quote}"</p>
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

            {/* FAQ */}
            <section className="py-12">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Perguntas frequentes</h2>
                </div>
                <div className="mx-auto flex max-w-2xl flex-col gap-3">
                    {FAQ.map(([q, a]) => (
                        <details key={q} className="group rounded-xl border bg-card px-5 py-4">
                            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                                {q}
                                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="mt-3 text-sm text-muted-foreground">{a}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="my-8 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-muted/30 p-8 sm:flex-row">
                <div>
                    <h2 className="text-2xl font-bold">Pronto para começar?</h2>
                    <p className="mt-1 text-muted-foreground">Inscreve-te num curso e recebe o teu certificado.</p>
                </div>
                <Button asChild size="lg">
                    <Link href="/register">Criar conta grátis</Link>
                </Button>
            </section>
        </PublicLayout>
    );
}
