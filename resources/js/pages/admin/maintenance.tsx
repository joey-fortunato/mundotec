import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MaintenanceSettings({ enabled, message }: { enabled: boolean; message: string | null }) {
    const { data, setData, put, processing, errors } = useForm({
        enabled,
        message: message ?? '',
    });

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
            <Head title="Modo de manutenção" />

            <div>
                <h1 className="text-2xl font-bold">Modo de manutenção</h1>
                <p className="mt-1 text-muted-foreground">
                    Quando ativo, os visitantes veem uma página a informar que o site está em manutenção. Os administradores
                    continuam a aceder normalmente ao painel.
                </p>
            </div>

            <Card>
                <CardContent className="flex flex-col gap-6 pt-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <span
                                className={`mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full ${
                                    data.enabled ? 'bg-amber-500/15 text-amber-600' : 'bg-emerald-500/15 text-emerald-600'
                                }`}
                            >
                                {data.enabled ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                            </span>
                            <div>
                                <div className="font-medium">
                                    {data.enabled ? 'Site em manutenção' : 'Site disponível'}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {data.enabled
                                        ? 'Os visitantes não conseguem aceder às páginas públicas.'
                                        : 'Todas as páginas estão acessíveis ao público.'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={data.enabled}
                            aria-label="Ativar modo de manutenção"
                            onClick={() => setData('enabled', !data.enabled)}
                            className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors ${
                                data.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                    data.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="maintenance-message" className="text-sm font-medium">
                            Mensagem para os visitantes <span className="text-muted-foreground">(opcional)</span>
                        </label>
                        <textarea
                            id="maintenance-message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="Ex.: Estamos a melhorar a plataforma. Voltamos em breve!"
                            className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        />
                        <InputError message={errors.message} />
                    </div>

                    <div>
                        <Button onClick={() => put('/admin/manutencao')} disabled={processing}>
                            Guardar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

MaintenanceSettings.layout = { breadcrumbs: [{ title: 'Modo de manutenção', href: '/admin/manutencao' }] };
