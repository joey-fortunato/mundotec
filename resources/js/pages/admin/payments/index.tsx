import { Head, router } from '@inertiajs/react';
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Payment = {
    id: number;
    reference: string;
    amount: string;
    installment_number: number;
    status: string;
    status_label: string;
    student: string;
    student_email: string;
    course: string;
    order_reference: string;
    proof_url: string | null;
    created_at: string | null;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    confirmed: 'default',
    pending: 'secondary',
    failed: 'destructive',
};

export default function PaymentsIndex({ payments }: { payments: Payment[] }) {
    function confirm(p: Payment) {
        if (
            confirm2(
                `Confirmar o pagamento ${p.reference} de ${p.student}? O acesso ao curso será libertado.`,
            )
        ) {
            router.post(
                `/admin/pagamentos/${p.id}/confirmar`,
                {},
                { preserveScroll: true },
            );
        }
    }

    function reject(p: Payment) {
        if (confirm2(`Rejeitar o pagamento ${p.reference}?`)) {
            router.post(
                `/admin/pagamentos/${p.id}/rejeitar`,
                {},
                { preserveScroll: true },
            );
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <Head title="Pagamentos" />
            <Heading
                title="Pagamentos"
                description="Confirma os comprovativos de transferência para libertar o acesso."
            />

            {payments.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground">
                    Ainda não há pagamentos.
                </Card>
            ) : (
                <Card className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Aluno</th>
                                <th className="px-4 py-3 font-medium">Curso</th>
                                <th className="px-4 py-3 font-medium">
                                    Prestação
                                </th>
                                <th className="px-4 py-3 font-medium">Valor</th>
                                <th className="px-4 py-3 font-medium">
                                    Comprovativo
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {p.student}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {p.student_email}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{p.course}</td>
                                    <td className="px-4 py-3">
                                        #{p.installment_number}
                                    </td>
                                    <td className="px-4 py-3">{p.amount}</td>
                                    <td className="px-4 py-3">
                                        {p.proof_url ? (
                                            <a
                                                href={p.proof_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-primary hover:underline"
                                            >
                                                Ver{' '}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                statusVariant[p.status] ??
                                                'secondary'
                                            }
                                        >
                                            {p.status_label}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.status === 'pending' ? (
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => confirm(p)}
                                                    aria-label="Confirmar"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => reject(p)}
                                                    aria-label="Rejeitar"
                                                >
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-right text-xs text-muted-foreground">
                                                {p.created_at}
                                            </div>
                                        )}
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

function confirm2(message: string): boolean {
    return window.confirm(message);
}

PaymentsIndex.layout = {
    breadcrumbs: [{ title: 'Pagamentos', href: '/admin/pagamentos' }],
};
