import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Role = { value: string; label: string };
type EditUser = { id: number; name: string; email: string; phone: string | null; role: string };

export default function UserForm({ user, roles }: { user?: EditUser; roles: Role[] }) {
    const isEdit = !!user;
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        role: user?.role ?? 'student',
        password: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEdit) {
put(`/admin/users/${user!.id}`);
} else {
post('/admin/users');
}
    }

    return (
        <div className="mx-auto w-full max-w-xl p-4">
            <Head title={isEdit ? 'Editar utilizador' : 'Novo utilizador'} />
            <Heading
                title={isEdit ? 'Editar utilizador' : 'Novo utilizador'}
                description={isEdit ? user!.name : 'Cria um aluno, instrutor ou administrador.'}
            />

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="9XX XXX XXX" />
                                <InputError message={errors.phone} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Papel</Label>
                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">{isEdit ? 'Nova palavra-passe (opcional)' : 'Palavra-passe'}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required={!isEdit}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? 'Guardar alterações' : 'Criar utilizador'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

UserForm.layout = {
    breadcrumbs: [
        { title: 'Utilizadores', href: '/admin/users' },
        { title: 'Formulário', href: '#' },
    ],
};
