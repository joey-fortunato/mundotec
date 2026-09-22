import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { CertificatePlate } from '@/components/certificate-plate';
import { Button } from '@/components/ui/button';

type Cert = {
    serial: string;
    student: string;
    course: string;
    hours: number | null;
    issued_at: string;
};

export default function CertificateVerify({ certificate }: { certificate: Cert }) {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Head title="Verificação de certificado" />
            <div className="mx-auto max-w-4xl p-6 sm:p-10">
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Certificado válido</h1>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Este certificado foi emitido pela Mundo da Tecnologia a <strong>{certificate.student}</strong> em{' '}
                        {certificate.issued_at}. ID {certificate.serial}.
                    </p>
                </div>
                <CertificatePlate certificate={certificate} />
                <div className="mt-6 text-center">
                    <Button asChild variant="outline">
                        <Link href="/cursos">Ver cursos</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
