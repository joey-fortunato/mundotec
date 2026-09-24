import { Head, Link } from '@inertiajs/react';
import { Building2, CheckCircle2, Presentation, Users } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AREAS = [
    ['Tecnologia', 'Redes, Windows Server, programação e cibersegurança para as tuas equipas.'],
    ['Marketing & Design', 'Marketing digital, gestão de redes sociais e design gráfico.'],
    ['Gestão & Administração', 'Primavera ERP, contabilidade, RH e produtividade.'],
];

const INCLUDES = [
    'Formação à medida da tua empresa',
    'Presencial ou online',
    'Formadores certificados',
    'Certificado de participação',
];

export default function Treinamentos() {
    return (
        <PublicLayout>
            <Head title="Treinamentos" />
            <PageHero
                eyebrow="Treinamentos corporativos"
                title="Capacitação para empresas"
                subtitle="Programas de formação desenhados à medida da tua organização, para elevar as competências das tuas equipas."
            >
                <Button asChild size="lg">
                    <Link href="/contactos">Pedir proposta</Link>
                </Button>
            </PageHero>

            <section className="grid gap-4 py-12 md:grid-cols-3">
                {AREAS.map(([title, desc]) => (
                    <Card key={title}>
                        <CardContent className="pt-6">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Presentation className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold">{title}</h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid items-center gap-8 py-6 md:grid-cols-2">
                <Card className="bg-primary/5">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <Users className="h-10 w-10 text-primary" />
                        <div>
                            <div className="text-2xl font-bold">+1000 treinamentos</div>
                            <div className="text-sm text-muted-foreground">realizados para empresas e instituições.</div>
                        </div>
                    </CardContent>
                </Card>
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <Building2 className="h-5 w-5 text-primary" /> O que está incluído
                    </h2>
                    <ul className="mt-4 flex flex-col gap-3">
                        {INCLUDES.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </PublicLayout>
    );
}
