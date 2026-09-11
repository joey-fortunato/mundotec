import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Category = {
    id: number;
    name: string;
    description: string | null;
    courses_count: number;
};

export default function CategoriesIndex({
    categories,
}: {
    categories: Category[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/categories', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    function remove(category: Category) {
        if (category.courses_count > 0) {
            alert(
                'Não é possível remover uma categoria com cursos associados.',
            );

            return;
        }

        if (confirm(`Remover a categoria "${category.name}"?`)) {
            router.delete(`/admin/categories/${category.id}`, {
                preserveScroll: true,
            });
        }
    }

    return (
        <>
            <Head title="Categorias" />
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                <Heading
                    title="Categorias"
                    description="Áreas usadas para organizar o catálogo de cursos."
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Nova categoria
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="flex flex-col gap-4 sm:flex-row sm:items-end"
                        >
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="description">
                                    Descrição (opcional)
                                </Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>
                            <Button type="submit" disabled={processing}>
                                <Plus className="mr-2 h-4 w-4" /> Adicionar
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="p-0">
                    {categories.length === 0 ? (
                        <p className="p-8 text-center text-muted-foreground">
                            Ainda não há categorias.
                        </p>
                    ) : (
                        <ul className="divide-y">
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {category.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {category.courses_count} curso(s)
                                            {category.description
                                                ? ` · ${category.description}`
                                                : ''}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(category)}
                                        aria-label="Remover"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [{ title: 'Categorias', href: '/admin/categories' }],
};
