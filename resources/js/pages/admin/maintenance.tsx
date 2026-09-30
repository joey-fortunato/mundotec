import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ImageUp, RotateCcw } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
    enabled: boolean;
    message: string | null;
    background: string;
    hasCustomBackground: boolean;
};

export default function MaintenanceSettings({ enabled, message, background, hasCustomBackground }: Props) {
    const [preview, setPreview] = useState<string>(background);
    const { data, setData, transform, post, processing, errors } = useForm({
        enabled,
        message: message ?? '',
        background: null as File | null,
        remove_background: false,
    });

    transform((d) => ({ ...d, _method: 'put' }));

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

                    <div className="grid gap-2">
                        <span className="text-sm font-medium">Imagem de fundo</span>
                        <div className="overflow-hidden rounded-xl border">
                            <div
                                className="flex h-44 items-end bg-[#0b1220] bg-cover bg-center p-3"
                                style={{ backgroundImage: `url('${preview}')` }}
                            >
                                <span className="rounded-md bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
                                    Pré-visualização
                                </span>
                            </div>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <label
                                htmlFor="maintenance-bg"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/10"
                            >
                                <ImageUp className="h-4 w-4 text-primary" />
                                Escolher imagem
                            </label>
                            <input
                                id="maintenance-bg"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setData('background', file);
                                    setData('remove_background', false);
                                    setPreview(file ? URL.createObjectURL(file) : background);
                                }}
                            />

                            {(hasCustomBackground || data.background) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setData('background', null);
                                        setData('remove_background', true);
                                        setPreview('/images/maintence.jpg');
                                    }}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Repor imagem padrão
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP até 6 MB. Recomendado: paisagem (ex.: 1920×1080).</p>
                        <InputError message={errors.background} />
                    </div>

                    <div>
                        <Button onClick={() => post('/admin/manutencao', { forceFormData: true })} disabled={processing}>
                            Guardar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

MaintenanceSettings.layout = { breadcrumbs: [{ title: 'Modo de manutenção', href: '/admin/manutencao' }] };
