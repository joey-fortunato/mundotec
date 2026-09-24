import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Printer } from 'lucide-react';
import { CertificatePlate } from '@/components/certificate-plate';
import { Button } from '@/components/ui/button';

type Cert = {
    serial: string;
    student: string;
    course: string;
    hours: number | null;
    issued_at: string;
};

export default function CertificateShow({ certificate }: { certificate: Cert }) {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Head title={`Certificado — ${certificate.course}`} />
            <div className="flex items-center justify-between border-b bg-background px-6 py-3.5">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/certificados">
                        <ChevronLeft className="mr-1 h-4 w-4" /> Certificados
                    </Link>
                </Button>
                <Button size="sm" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Descarregar / Imprimir
                </Button>
            </div>
            <div className="mx-auto max-w-4xl p-6 sm:p-10">
                <CertificatePlate certificate={certificate} />
            </div>
        </div>
    );
}
