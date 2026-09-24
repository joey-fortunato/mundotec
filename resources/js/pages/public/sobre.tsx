import { Head, Link } from '@inertiajs/react';
import { Award, Heart, MapPin, Target } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STATS = [
    ['+300', 'graduados'],
    ['+1000', 'estagiários'],
    ['+1000', 'treinamentos'],
];

const VALUES = [
    [Target, 'Missão', 'Elevar carreiras com formação acessível, prática e certificada.'],
    [Award, 'Certificação', 'Cursos reconhecidos pelo INEFOP, com valor no mercado de trabalho.'],
    [Heart, 'Proximidade', 'Acompanhamento real do formando, do início ao certificado.'],
];

export default function Sobre() {
    return (
        <PublicLayout>
            <Head title="Sobre nós" />
            <PageHero
                eyebrow="Sobre nós"
                title="Nós Elevamos Você"
                subtitle="A Mundo da Tecnologia é uma escola de formação profissional em Angola, focada em preparar jovens e profissionais para o mercado de trabalho."
            />

            <section className="grid gap-4 py-12 sm:grid-cols-3">
                {STATS.map(([value, label]) => (
                    <Card key={label} className="text-center">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-primary">{value}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                {VALUES.map(([Icon, title, desc]) => {
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

            <section className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Rangel, Vila Alice, Rua João de Deus, Luanda', 'Zango III, Primeira Paragem'].map((addr) => (
                    <Card key={addr}>
                        <CardContent className="flex items-center gap-3 pt-6">
                            <MapPin className="h-5 w-5 flex-none text-primary" />
                            <span className="text-sm">{addr}</span>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="my-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary p-8 text-primary-foreground sm:flex-row">
                <h2 className="text-2xl font-bold text-primary-foreground">Faz parte da próxima turma</h2>
                <Button asChild size="lg" variant="secondary">
                    <Link href="/cursos">Ver cursos</Link>
                </Button>
            </section>
        </PublicLayout>
    );
}
