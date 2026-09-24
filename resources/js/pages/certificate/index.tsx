import { Head, Link } from '@inertiajs/react';
import { Award, Download } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Certificate = { serial: string; course_title: string; issued_at: string };

export default function CertificatesIndex({ certificates }: { certificates: Certificate[] }) {
    return (
        <div className="mx-auto w-full max-w-3xl p-4">
            <Head title="Certificados" />
            <Heading
                title="Certificados"
                description="Emitidos ao concluíres 100% de um curso. Descarrega ou partilha."
            />

            {certificates.length === 0 ? (
                <Card className="flex flex-col items-center gap-3 p-10 text-center">
                    <Award className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Ainda não tens certificados. Conclui um curso para o receber.</p>
                    <Button asChild>
                        <Link href="/os-meus-cursos">Os meus cursos</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {certificates.map((c) => (
                        <Card key={c.serial} className="overflow-hidden">
                            <div className="flex h-28 items-center justify-center bg-primary text-primary-foreground">
                                <div className="rounded border border-white/50 px-5 py-3 text-center">
                                    <div className="text-[10px] tracking-widest opacity-85">CERTIFICADO</div>
                                    <div className="mt-1 text-sm font-semibold">{c.course_title}</div>
                                </div>
                            </div>
                            <CardContent className="pt-4">
                                <div className="font-semibold">{c.course_title}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    Emitido {c.issued_at} · ID {c.serial}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <Button asChild size="sm">
                                        <Link href={`/certificados/${c.serial}`}>
                                            <Download className="mr-1.5 h-4 w-4" /> Ver / PDF
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/verificar/${c.serial}`}>Verificar</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

CertificatesIndex.layout = {
    breadcrumbs: [{ title: 'Certificados', href: '/certificados' }],
};
