import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    role_label: string;
    created_at: string | null;
};
type Role = { value: string; label: string };

const roleVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    admin: 'default',
    instructor: 'secondary',
    student: 'outline',
};

export default function UsersIndex({ users, roles, activeRole }: { users: User[]; roles: Role[]; activeRole: string | null }) {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const filteredUsers = useMemo(() => users.filter(user => `${user.name} ${user.email} ${user.phone ?? ''}`.toLowerCase().includes(query.toLowerCase())), [users, query]);
    function remove(u: User) {
        if (window.confirm(`Remover o utilizador "${u.name}"?`)) {
            router.delete(`/admin/users/${u.id}`, { preserveScroll: true });
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <Head title="Utilizadores" />
            <div className="flex items-center justify-between">
                <Heading title="Utilizadores" description="Gere alunos, instrutores e administradores." />
                <Button asChild>
                    <Link href="/admin/users/create">
                        <UserPlus className="mr-2 h-4 w-4" /> Novo utilizador
                    </Link>
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                <Link
                    href="/admin/users"
                    className={`rounded-full border px-3 py-1 text-sm ${!activeRole ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                    Todos
                </Link>
                {roles.map((r) => (
                    <Link
                        key={r.value}
                        href={`/admin/users?papel=${r.value}`}
                        className={`rounded-full border px-3 py-1 text-sm ${activeRole === r.value ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                        {r.label}
                    </Link>
                ))}
            </div>
            <div className="relative max-w-md"><Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} className="pl-9" placeholder="Pesquisar utilizadores…" /></div>
            {selected.length > 0 && <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary"><span>{selected.length} utilizador(es) selecionado(s)</span><Button size="sm" variant="ghost" onClick={() => setSelected([])}>Limpar seleção</Button></div>}

            {filteredUsers.length === 0 ? (
                <Card className="flex flex-col items-center gap-3 p-10 text-center">
                    <p className="text-muted-foreground">Sem utilizadores nesta vista.</p>
                    <Button asChild>
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" /> Criar utilizador
                        </Link>
                    </Button>
                </Card>
            ) : (
                <Card className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr>
                                <th className="w-10 px-4 py-3"><Checkbox checked={filteredUsers.length > 0 && filteredUsers.every(user => selected.includes(user.id))} onCheckedChange={checked => setSelected(checked === true ? filteredUsers.map(user => user.id) : [])} aria-label="Selecionar todos os utilizadores" /></th>
                                <th className="px-4 py-3 font-medium">Nome</th>
                                <th className="px-4 py-3 font-medium">Contacto</th>
                                <th className="px-4 py-3 font-medium">Papel</th>
                                <th className="px-4 py-3 font-medium">Registo</th>
                                <th className="px-4 py-3 text-right font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                                {filteredUsers.map((u) => (
                                <tr key={u.id} className="border-b last:border-0">
                                    <td className="px-4 py-3"><Checkbox checked={selected.includes(u.id)} onCheckedChange={checked => setSelected(checked === true ? [...selected, u.id] : selected.filter(id => id !== u.id))} aria-label={`Selecionar ${u.name}`} /></td>
                                    <td className="px-4 py-3 font-medium">{u.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        <div>{u.email}</div>
                                        {u.phone && <div className="text-xs">{u.phone}</div>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={roleVariant[u.role] ?? 'outline'}>{u.role_label}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{u.created_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon" aria-label="Editar">
                                                <Link href={`/admin/users/${u.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => remove(u)} aria-label="Remover">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
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

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Utilizadores', href: '/admin/users' }],
};
