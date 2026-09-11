import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Option = { id: number; name: string };
type StatusOption = { value: string; label: string };

export type CourseFormOptions = {
    categories: Option[];
    instructors: Option[];
    statuses: StatusOption[];
};

export type CourseFormValues = {
    title: string;
    subtitle: string;
    description: string;
    category_id: string;
    instructor_id: string;
    price: string;
    max_installments: string;
    level: string;
    duration_minutes: string;
    status: string;
};

type Props = {
    options: CourseFormOptions;
    initial?: Partial<CourseFormValues>;
    submitUrl: string;
    method: 'post' | 'put';
    submitLabel: string;
};

const NONE = 'none';

export function CourseForm({
    options,
    initial,
    submitUrl,
    method,
    submitLabel,
}: Props) {
    const { data, setData, post, put, processing, errors } =
        useForm<CourseFormValues>({
            title: initial?.title ?? '',
            subtitle: initial?.subtitle ?? '',
            description: initial?.description ?? '',
            category_id: initial?.category_id ?? '',
            instructor_id: initial?.instructor_id ?? '',
            price: initial?.price ?? '',
            max_installments: initial?.max_installments ?? '1',
            level: initial?.level ?? '',
            duration_minutes: initial?.duration_minutes ?? '',
            status: initial?.status ?? 'draft',
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const action = method === 'post' ? post : put;
        action(submitUrl);
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do curso</CardTitle>
                    <CardDescription>
                        Informação principal apresentada aos alunos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="subtitle">Subtítulo</Label>
                        <Input
                            id="subtitle"
                            value={data.subtitle}
                            onChange={(e) =>
                                setData('subtitle', e.target.value)
                            }
                        />
                        <InputError message={errors.subtitle} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={5}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                        />
                        <InputError message={errors.description} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Classificação e preço</CardTitle>
                    <CardDescription>
                        Categoria, instrutor, valor em Kwanzas e prestações.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label>Categoria</Label>
                        <Select
                            value={
                                data.category_id === ''
                                    ? NONE
                                    : data.category_id
                            }
                            onValueChange={(v) =>
                                setData('category_id', v === NONE ? '' : v)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sem categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NONE}>
                                    Sem categoria
                                </SelectItem>
                                {options.categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Instrutor</Label>
                        <Select
                            value={
                                data.instructor_id === ''
                                    ? NONE
                                    : data.instructor_id
                            }
                            onValueChange={(v) =>
                                setData('instructor_id', v === NONE ? '' : v)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sem instrutor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NONE}>
                                    Sem instrutor
                                </SelectItem>
                                {options.instructors.map((i) => (
                                    <SelectItem key={i.id} value={String(i.id)}>
                                        {i.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.instructor_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price">Preço (AOA)</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            required
                        />
                        <InputError message={errors.price} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="max_installments">
                            Máx. de prestações
                        </Label>
                        <Input
                            id="max_installments"
                            type="number"
                            min="1"
                            max="24"
                            value={data.max_installments}
                            onChange={(e) =>
                                setData('max_installments', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.max_installments} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="level">Nível</Label>
                        <Input
                            id="level"
                            value={data.level}
                            onChange={(e) => setData('level', e.target.value)}
                            placeholder="Ex.: Iniciante"
                        />
                        <InputError message={errors.level} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="duration_minutes">
                            Duração (minutos)
                        </Label>
                        <Input
                            id="duration_minutes"
                            type="number"
                            min="0"
                            value={data.duration_minutes}
                            onChange={(e) =>
                                setData('duration_minutes', e.target.value)
                            }
                        />
                        <InputError message={errors.duration_minutes} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Estado</Label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.statuses.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {processing && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
