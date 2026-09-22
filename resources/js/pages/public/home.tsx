import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Award, GraduationCap, Laptop, Megaphone, ShieldCheck, Star } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Course = { title: string; slug: string; price: string; currency: string; category: string | null };
type Category = { name: string; slug: string; description: string | null; courses_count: number };
type Stats = { graduates: number; internships: number; courses: number };

function money(value: string, currency: string) {
    return `${Number(value).toLocaleString('pt-PT', { maximumFractionDigits: 0 })} ${currency}`;
}

const categoryIcon: Record<string, typeof Laptop> = {
    tecnologia: Laptop,
    'marketing-design-grafico': Megaphone,
    'marketing-e-design': Megaphone,
    administrativos: GraduationCap,
};

export default function Home({ featured, categories, stats }: { featured: Course[]; categories: Category[]; stats: Stats }) {
    return (
        <PublicLayout>
            <Head title="Formação profissional certificada" />

            <section className="grid items-center gap-8 py-8 md:grid-cols-2">
                <div>
                    <Badge variant="secondary" className="gap-1.5">
                        <Award className="h-3.5 w-3.5" /> Certificação reconhecida pelo INEFOP
                    </Badge>
                    <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
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
                <div className="rounded-2xl bg-primary/5 p-8">
                    <div className="flex aspect-video items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Laptop className="h-16 w-16 opacity-70" />
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto mb-8 max-w-lg text-center">
                    <h2 className="text-2xl font-bold">Áreas de formação</h2>
                    <p className="mt-2 text-muted-foreground">Escolhe o teu caminho e começa hoje.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((c) => {
                        const Icon = categoryIcon[c.slug] ?? GraduationCap;

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
                <section className="py-10">
                    <div className="mb-6 flex items-end justify-between">
                        <h2 className="text-2xl font-bold">Cursos em destaque</h2>
                        <Link href="/cursos" className="text-sm font-semibold text-primary">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map((course) => (
                            <Link key={course.slug} href={`/cursos/${course.slug}`} className="group">
                                <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
                                    <div className="h-24 bg-primary" />
                                    <CardHeader>
                                        {course.category && (
                                            <Badge variant="secondary" className="w-fit">
                                                {course.category}
                                            </Badge>
                                        )}
                                        <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <span className="font-bold">{money(course.price, course.currency)}</span>
                                        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                                            Ver <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="grid items-center gap-10 py-10 md:grid-cols-2">
                <div>
                    <h2 className="text-2xl font-bold">Porquê a Mundo da Tecnologia?</h2>
                    <div className="mt-6 flex flex-col gap-5">
                        {[
                            [Award, 'Certificado INEFOP', 'Reconhecido no mercado de trabalho angolano.'],
                            [ShieldCheck, 'Projetos reais', 'Aprende a fazer, não só a assistir.'],
                            [GraduationCap, 'Estágios e emprego', 'Ligação a empresas e programa de estágios.'],
                        ].map(([Icon, title, desc]) => {
                            const I = Icon as typeof Award;

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
                <Card className="bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="font-serif text-4xl text-primary">"</div>
                        <p className="text-lg leading-relaxed">
                            O curso de redes mudou a minha carreira. Em três meses já estava a trabalhar na área.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                                JN
                            </div>
                            <div>
                                <div className="text-sm font-semibold">João Neto</div>
                                <div className="text-xs text-muted-foreground">Técnico de Redes · CCNA</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
