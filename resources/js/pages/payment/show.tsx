import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2, Clock, Upload } from 'lucide-react';
import { useRef } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Payment = {
    reference: string;
    amount: string;
    installment_number: number;
    status: string;
    status_label: string;
    created_at: string | null;
};

type Props = {
    enrollment: {
        id: number;
        status: string;
        status_label: string;
        course_title: string;
    };
    order: {
        reference: string;
        total: string;
        currency: string;
        installments: number;
        installment_amount: string;
        status: string;
        status_label: string;
        payments: Payment[];
    };
    bank: { name: string; account_holder: string; iban: string };
};

function money(value: string, currency: string) {
    return `${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function PaymentShow({ enrollment, order, bank }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const { setData, post, processing, errors, reset } = useForm<{
        proof: File | null;
    }>({ proof: null });
    const isActive = enrollment.status === 'active';

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/matriculas/${enrollment.id}/pagamento`, {
            forceFormData: true,
            onSuccess: () => {
                reset();

                if (fileRef.current) {
                    fileRef.current.value = '';
                }
            },
        });
    }

    return (
        <div className="mx-auto w-full max-w-2xl p-4">
            <Head title="Pagamento" />
            <Heading
                title="Pagamento da inscrição"
                description={enrollment.course_title}
            />

            {isActive && (
                <Card className="mb-4 border-green-600/40 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="text-sm">
                            Acesso ativo — já podes aceder ao curso em "Os meus
                            cursos".
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card className="mb-4">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                            Dados para transferência
                        </CardTitle>
                        <Badge
                            variant={
                                order.status === 'paid'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {order.status_label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                    <Row label="Banco" value={bank.name} />
                    <Row label="Titular" value={bank.account_holder} />
                    <Row label="IBAN" value={bank.iban} mono />
                    <Row label="Referência" value={order.reference} mono />
                    <div className="mt-2 flex items-center justify-between border-t pt-3">
                        <span className="text-muted-foreground">
                            {order.installments > 1
                                ? `Valor por prestação (${order.installments}x)`
                                : 'Valor a pagar'}
                        </span>
                        <span className="text-lg font-semibold">
                            {money(order.installment_amount, order.currency)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-base">
                        Enviar comprovativo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) =>
                                setData('proof', e.target.files?.[0] ?? null)
                            }
                            className="block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                        />
                        <InputError message={errors.proof} />
                        <Button
                            type="submit"
                            disabled={processing}
                            className="self-start"
                        >
                            <Upload className="mr-2 h-4 w-4" /> Enviar
                            comprovativo
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Aceita JPG, PNG ou PDF, até 5 MB.
                        </p>
                    </form>
                </CardContent>
            </Card>

            {order.payments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Comprovativos enviados
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {order.payments.map((p) => (
                            <div
                                key={p.reference}
                                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    {p.status === 'confirmed' ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    Prestação {p.installment_number} ·{' '}
                                    {money(p.amount, order.currency)}
                                </span>
                                <Badge
                                    variant={
                                        p.status === 'confirmed'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {p.status_label}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="mt-6">
                <Button
                    variant="ghost"
                    onClick={() => router.get('/os-meus-cursos')}
                >
                    ← Os meus cursos
                </Button>
            </div>
        </div>
    );
}

function Row({
    label,
    value,
    mono,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className={mono ? 'font-mono' : ''}>{value}</span>
        </div>
    );
}

PaymentShow.layout = {
    breadcrumbs: [
        { title: 'Os meus cursos', href: '/os-meus-cursos' },
        { title: 'Pagamento', href: '#' },
    ],
};
