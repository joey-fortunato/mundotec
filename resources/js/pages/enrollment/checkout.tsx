import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Course = {
    title: string;
    slug: string;
    price: string;
    currency: string;
    max_installments: number;
};

function money(value: number, currency: string) {
    return `${value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function Checkout({ course }: { course: Course }) {
    const { data, setData, post, processing } = useForm({ installments: '1' });
    const price = Number(course.price);
    const n = Number(data.installments);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/cursos/${course.slug}/inscrever`);
    }

    return (
        <div className="mx-auto w-full max-w-xl p-4">
            <Head title={`Inscrição — ${course.title}`} />
            <Heading title="Concluir inscrição" description={course.title} />

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Plano de pagamento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <span className="text-muted-foreground">
                                Total do curso
                            </span>
                            <span className="text-lg font-semibold">
                                {money(price, course.currency)}
                            </span>
                        </div>

                        <div className="grid gap-2">
                            <Label>Número de prestações</Label>
                            <Select
                                value={data.installments}
                                onValueChange={(v) =>
                                    setData('installments', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(
                                        { length: course.max_installments },
                                        (_, i) => i + 1,
                                    ).map((num) => (
                                        <SelectItem
                                            key={num}
                                            value={String(num)}
                                        >
                                            {num}x
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {n > 1 && (
                                <p className="text-sm text-muted-foreground">
                                    {n}x de {money(price / n, course.currency)}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing} size="lg">
                            {processing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Continuar para pagamento
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            Pagamento por Multicaixa Express. O acesso é
                            libertado após a confirmação do pagamento.
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

Checkout.layout = {
    breadcrumbs: [
        { title: 'Cursos', href: '/cursos' },
        { title: 'Inscrição', href: '#' },
    ],
};
