import { Head, Link } from '@inertiajs/react';
import { Briefcase, Building2, GraduationCap, Users } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BENEFITS = [
    [Briefcase, 'Experiência prática', 'Trabalha em projetos reais e ganha experiência que conta no currículo.'],
    [Building2, 'Ligação a empresas', 'Colocação em empresas parceiras nas áreas de tecnologia e gestão.'],
    [GraduationCap, 'Acompanhamento', 'Mentoria de formadores durante todo o período de estágio.'],
];

export default function Estagios() {
    return (
        <PublicLayout>
            <Head title="Estágios" />
            <PageHero
                eyebrow="Programa de estágios"
                title="Da formação ao primeiro emprego"
                subtitle="Damos o próximo passo contigo: estágios profissionais que ligam a tua formação ao mercado de trabalho."
            >
                <Button asChild size="lg">
                    <Link href="/contactos">Candidatar-me</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/cursos">Ver cursos</Link>
                </Button>
            </PageHero>

            <section className="grid gap-4 py-12 sm:grid-cols-3">
                {BENEFITS.map(([Icon, title, desc]) => {
                    const I = Icon;

                    return (
                        <Card key={title as string}>
                            <CardContent className="pt-6">
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <I className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold">{title as string}</h3>
                                <p className="mt-1.5 text-sm text-muted-foreground">{desc as string}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-muted/30 p-8 sm:flex-row">
                <div className="flex items-center gap-4">
                    <Users className="h-10 w-10 text-primary" />
                    <div>
                        <div className="text-2xl font-bold">+1000 estagiários</div>
                        <div className="text-sm text-muted-foreground">já passaram pelo nosso programa de estágios.</div>
                    </div>
                </div>
                <Button asChild size="lg">
                    <Link href="/register">Começar agora</Link>
                </Button>
            </section>
        </PublicLayout>
    );
}
