import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Payment = {
    reference: string;
    course: string;
    installment_number: number;
    installments: number;
    amount: string;
    status: string;
    status_label: string;
    date: string | null;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    confirmed: 'default',
    pending: 'secondary',
    failed: 'destructive',
};

export default function Faturas({ payments, totalPaid }: { payments: Payment[]; totalPaid: string }) {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
            <Head title="Pagamentos & faturas" />
            <Heading title="Pagamentos & faturas" description="Histórico de transações Multicaixa Express." />

            <Card className="w-fit">
                <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Total pago</div>
                    <div className="mt-1 text-2xl font-bold">
                        {Number(totalPaid).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} AOA
                    </div>
                </CardContent>
            </Card>

            {payments.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground">Ainda não há pagamentos.</Card>
            ) : (
                <Card className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Data</th>
                                <th className="px-4 py-3 font-medium">Curso</th>
                                <th className="px-4 py-3 font-medium">Prest.</th>
                                <th className="px-4 py-3 font-medium">Valor</th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p.reference} className="border-b last:border-0">
                                    <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
                                    <td className="px-4 py-3 font-medium">{p.course}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {p.installment_number}/{p.installments}
                                    </td>
                                    <td className="px-4 py-3">{p.amount}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[p.status] ?? 'secondary'}>{p.status_label}</Badge>
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

Faturas.layout = {
    breadcrumbs: [{ title: 'Pagamentos', href: '/faturas' }],
};
