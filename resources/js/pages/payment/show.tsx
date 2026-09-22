import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2, Clock, Smartphone } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Payment = {
    reference: string;
    amount: string;
    installment_number: number;
    status: string;
    status_label: string;
    created_at: string | null;
};

type Props = {
    enrollment: { id: number; status: string; status_label: string; course_title: string };
    order: {
        reference: string;
        total: string;
        currency: string;
        installments: number;
        installment_amount: string;
        status: string;
        status_label: string;
        paid_count: number;
        payments: Payment[];
    };
    pendingPhone: string | null;
};

function money(value: string, currency: string) {
    return `${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function PaymentShow({ enrollment, order, pendingPhone }: Props) {
    const { data, setData, post, processing, errors } = useForm({ phone: '' });
    const isActive = enrollment.status === 'active';
    const isPaid = order.status === 'paid';

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/matriculas/${enrollment.id}/pagamento`, { preserveScroll: true });
    }

    return (
        <div className="mx-auto w-full max-w-xl p-4">
            <Head title="Pagamento" />
            <Heading
                title="Pagamento da inscrição"
                description={`${enrollment.course_title} · via Multicaixa Express`}
            />

            {isActive && (
                <Card className="mb-4 border-green-600/40 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="text-sm">Acesso ativo — já podes aceder ao curso em "Os meus cursos".</p>
                    </CardContent>
                </Card>
            )}

            {pendingPhone ? (
                <Card className="mb-4">
                    <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Smartphone className="h-7 w-7 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">Confirma no teu telemóvel</h2>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            Enviámos um pedido de{' '}
                            <strong>{money(order.installment_amount, order.currency)}</strong> para o número{' '}
                            <strong>{pendingPhone}</strong>. Abre o app Multicaixa Express e confirma.
                        </p>
                        <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" /> A aguardar confirmação
                        </Badge>
                    </CardContent>
                </Card>
            ) : !isPaid ? (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle className="text-base">Pagar com Multicaixa Express</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                                <span className="text-muted-foreground">
                                    {order.installments > 1
                                        ? `Prestação ${order.paid_count + 1} de ${order.installments}`
                                        : 'Valor a pagar'}
                                </span>
                                <span className="text-lg font-semibold">
                                    {money(order.installment_amount, order.currency)}
                                </span>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Número de telefone associado</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="9XX XXX XXX"
                                    inputMode="tel"
                                    required
                                />
                                <InputError message={errors.phone} />
                            </div>
                            <Button type="submit" disabled={processing} size="lg">
                                <Smartphone className="mr-2 h-4 w-4" /> Enviar pedido de pagamento
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                Pagamento seguro processado pela EMIS · ref. {order.reference}
                            </p>
                        </form>
                    </CardContent>
                </Card>
            ) : null}

            {order.payments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Plano de prestações</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {order.payments.map((p) => (
                            <div key={p.reference} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                                <span className="flex items-center gap-2">
                                    {p.status === 'confirmed' ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    Prestação {p.installment_number} · {money(p.amount, order.currency)}
                                </span>
                                <Badge variant={p.status === 'confirmed' ? 'default' : 'secondary'}>{p.status_label}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="mt-6">
                <Button variant="ghost" onClick={() => router.get('/os-meus-cursos')}>
                    ← Os meus cursos
                </Button>
            </div>
        </div>
    );
}

PaymentShow.layout = {
    breadcrumbs: [
        { title: 'Os meus cursos', href: '/os-meus-cursos' },
        { title: 'Pagamento', href: '#' },
    ],
};
