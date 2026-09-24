import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';

type Certificate = { serial: string; student: string; course: string; issued_at: string };

export default function AdminCertificates({ certificates }: { certificates: Certificate[] }) {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Head title="Certificados" />
            <Heading title="Certificados" description="Certificados emitidos aos alunos na conclusão dos cursos." />

            {certificates.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground">Ainda não foram emitidos certificados.</Card>
            ) : (
                <Card className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Serial</th>
                                <th className="px-4 py-3 font-medium">Aluno</th>
                                <th className="px-4 py-3 font-medium">Curso</th>
                                <th className="px-4 py-3 font-medium">Emitido</th>
                                <th className="px-4 py-3 text-right font-medium">Verificar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.map((c) => (
                                <tr key={c.serial} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-mono text-xs">{c.serial}</td>
                                    <td className="px-4 py-3 font-medium">{c.student}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{c.course}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{c.issued_at}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/verificar/${c.serial}`} className="font-medium text-primary hover:underline">
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
}

AdminCertificates.layout = {
    breadcrumbs: [{ title: 'Certificados', href: '/admin/certificados' }],
};
