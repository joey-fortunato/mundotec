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
import type {CourseCardData} from '@/components/course-card';
import { CourseSlider } from '@/components/course-slider';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Category = { name: string; slug: string; description: string | null; courses_count: number };

const CATEGORY_ICON: Record<string, LucideIcon> = {
    tecnologia: Network,
    'marketing-design-grafico': Megaphone,
    'marketing-e-design': Megaphone,
    'marketing-digital-design-grafico': Megaphone,
    administrativos: FileSpreadsheet,
};

const TESTIMONIALS = [
    ['O curso de redes mudou a minha carreira. Em três meses já estava a trabalhar na área.', 'João Neto', 'Técnico de Redes · CCNA', 'JN'],
    ['Aprendi a criar sites do zero e hoje trabalho como freelancer.', 'Ana Kiala', 'Programadora Web', 'AK'],
    ['A formação em Primavera abriu-me portas no departamento financeiro.', 'Domingas Paulo', 'Assistente Administrativa', 'DP'],
    ['O acompanhamento dos formadores deu-me confiança para mudar de área.', 'Mateus António', 'Técnico de suporte', 'MA'],
    ['Em pouco tempo consegui aplicar no trabalho tudo o que aprendi.', 'Helena Chivela', 'Gestora administrativa', 'HC'],
    ['A componente prática fez toda a diferença para a minha evolução.', 'Rui Manuel', 'Designer gráfico', 'RM'],
    ['Saí preparado para entrevistas e consegui o meu primeiro estágio.', 'Lurdes Gomes', 'Estagiária de marketing', 'LG'],
    ['Gostei da flexibilidade e da clareza de cada aula.', 'Carlos Miguel', 'Empreendedor', 'CM'],
];

const FAQ = [
    ['Os certificados são reconhecidos?', 'Sim. Os nossos cursos são certificados e reconhecidos pelo INEFOP, com valor no mercado de trabalho angolano.'],
    ['Como faço o pagamento?', 'O pagamento é feito por Multicaixa Express, podendo ser em prestações consoante o curso.'],
    ['As aulas são presenciais ou online?', 'Temos formação online na plataforma e turmas presenciais em Luanda e no Zango III.'],
    ['Recebo apoio para estágio?', 'Sim. Temos um programa de estágios com ligação a empresas parceiras.'],
];

type Homepage = { metrics: { value: string; label: string }[]; partners: string[] };
type CategoryCourses = { name: string; description: string | null; courses: CourseCardData[] };

export default function Home({ featured, categories, homepage, categoryCourses, partnerLogos }: { featured: CourseCardData[]; categories: Category[]; homepage: Homepage; categoryCourses: CategoryCourses[]; partnerLogos: string[] }) {
    return (
        <PublicLayout>
            <Head title="Cursos Profissionais, Estágios e Treinamentos" />

            {/* Hero */}
            <section className="relative grid items-center gap-8 overflow-hidden py-10 md:grid-cols-2">
                <div className="home-orbit home-orbit-top" aria-hidden="true"><GraduationCap /></div>
                <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4">
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
                            <div className="text-2xl font-bold">{homepage.metrics[0]?.value ?? '+4.000'}</div>
                            <div className="text-xs text-muted-foreground">graduados</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{homepage.metrics[1]?.value ?? '+2.000'}</div>
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
                <div className="relative motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4">
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
            <section className="relative overflow-hidden py-12">
                <div className="home-orbit home-orbit-category" aria-hidden="true"><FileSpreadsheet /></div>
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Explore todas as categorias</h2>
                    <p className="mt-2 text-muted-foreground">Escolhe a tua área e começa hoje.</p>
                </div>
                <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            {featured.length > 0 && <CourseSlider title="Cursos recomendados" description="Os mais procurados este mês." courses={featured} />}

            {categoryCourses.map(category => <CourseSlider key={category.name} title={category.name} description={category.description} courses={category.courses} />)}

            {/* Nós Elevamos Você */}
            <section className="relative my-12 overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground">
                <div className="home-orbit home-orbit-light" aria-hidden="true"><Network /></div>
                <div className="relative mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-primary-foreground">Nós Elevamos Você</h2>
                    <p className="mt-2 opacity-85">Resultados que falam por si.</p>
                </div>
                <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                    {homepage.metrics.map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <div className="text-3xl font-bold sm:text-4xl">{value}</div>
                            <div className="mt-1 text-sm opacity-85">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {partnerLogos.length > 0 && <section className="py-10 motion-safe:animate-in motion-safe:fade-in">
                <div className="mx-auto mb-6 max-w-lg text-center"><h2 className="text-2xl font-bold">Empresas parceiras</h2><p className="mt-2 text-muted-foreground">Construímos oportunidades com quem move Angola.</p></div>
                <div className="flex gap-5 overflow-hidden py-3"><div className="partner-track">{[...partnerLogos, ...partnerLogos].map((logo, index) => <div key={`${logo}-${index}`} className="partner-logo"><img src={logo} alt="Parceiro MundoTec" /></div>)}</div></div>
            </section>}

            {/* Testimonials */}
            <section className="relative overflow-hidden py-6">
                <div className="home-orbit home-orbit-testimonial" aria-hidden="true"><Star /></div>
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">O que os nossos formandos dizem</h2>
                </div>
                <div className="relative overflow-hidden py-2">
                    <div className="testimonial-track">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map(([quote, name, role, ini], index) => (
                        <Card key={`${name}-${index}`} className="w-[min(82vw,360px)] flex-none">
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
                </div>
            </section>

            {/* FAQ */}
            <section className="relative overflow-hidden py-12">
                <div className="home-orbit home-orbit-faq" aria-hidden="true"><Award /></div>
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Perguntas frequentes</h2>
                </div>
                <div className="relative mx-auto flex max-w-2xl flex-col gap-3">
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
            <section className="relative my-8 flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border bg-muted/30 p-8 sm:flex-row">
                <div className="home-orbit home-orbit-cta" aria-hidden="true"><GraduationCap /></div>
                <div className="relative">
                    <h2 className="text-2xl font-bold">Pronto para começar?</h2>
                    <p className="mt-1 text-muted-foreground">Inscreve-te num curso e recebe o teu certificado.</p>
                </div>
                <Button asChild size="lg" className="relative">
                    <Link href="/register">Criar conta grátis</Link>
                </Button>
            </section>
        </PublicLayout>
    );
}
