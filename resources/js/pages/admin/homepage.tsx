import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Homepage = { metrics: { value: string; label: string }[]; partners: string[] };
type PartnerLogo = { path: string; url: string };

export default function HomepageEditor({ homepage, partnerLogos }: { homepage: Homepage; partnerLogos: PartnerLogo[] }) {
    const { data, setData, put, processing, errors } = useForm({ metrics: homepage.metrics, retain_logos: partnerLogos.map(logo => logo.path), partner_logos: [] as File[] });
    const updateMetric = (index: number, field: 'value' | 'label', value: string) => setData('metrics', data.metrics.map((metric, i) => i === index ? { ...metric, [field]: value } : metric));

    return <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4">
        <Head title="Página inicial" />
        <div><h1 className="text-2xl font-bold">Página inicial</h1><p className="mt-1 text-muted-foreground">Edita os números e os parceiros apresentados publicamente.</p></div>
        <Card><CardContent className="pt-6"><h2 className="font-semibold">Números em destaque</h2><div className="mt-4 flex flex-col gap-3">
            {data.metrics.map((metric, index) => <div key={index} className="grid gap-2 sm:grid-cols-[140px_1fr_auto]"><Input value={metric.value} onChange={e => updateMetric(index, 'value', e.target.value)} aria-label="Número" /><Input value={metric.label} onChange={e => updateMetric(index, 'label', e.target.value)} aria-label="Descrição" /><Button type="button" variant="ghost" size="icon" onClick={() => setData('metrics', data.metrics.filter((_, i) => i !== index))} aria-label="Remover número"><Trash2 className="h-4 w-4 text-destructive" /></Button></div>)}
        </div><Button type="button" variant="outline" className="mt-4" onClick={() => setData('metrics', [...data.metrics, { value: '', label: '' }])}><Plus className="mr-2 h-4 w-4" />Adicionar número</Button></CardContent></Card>
        <Card><CardContent className="pt-6"><h2 className="font-semibold">Logótipos dos parceiros</h2><p className="mt-1 text-sm text-muted-foreground">Envia imagens transparentes ou SVGs; serão exibidas num carrossel, sem texto.</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{partnerLogos.filter(logo => data.retain_logos.includes(logo.path)).map(logo => <div key={logo.path} className="relative rounded-xl border bg-muted/20 p-3"><img src={logo.url} alt="Parceiro" className="h-16 w-full object-contain" /><Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2" onClick={() => setData('retain_logos', data.retain_logos.filter(path => path !== logo.path))} aria-label="Remover logótipo"><Trash2 className="h-4 w-4 text-destructive" /></Button></div>)}</div><div className="mt-4"><label htmlFor="partner-logo-files" className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-primary/35 bg-primary/5 px-4 py-3 text-sm transition-all hover:border-primary hover:bg-primary/10 active:scale-[.99]"><span className="text-muted-foreground">Selecionar novos logótipos</span><Plus className="h-4 w-4 text-primary" /></label><input className="sr-only" id="partner-logo-files" type="file" accept="image/*" multiple onChange={event => setData('partner_logos', Array.from(event.target.files ?? []))} /></div><InputError message={errors.partner_logos} /></CardContent></Card>
        {errors.metrics && <p className="text-sm text-destructive">{errors.metrics}</p>}<Button onClick={() => put('/admin/pagina-inicial')} disabled={processing}>Guardar alterações</Button>
    </div>;
}

HomepageEditor.layout = { breadcrumbs: [{ title: 'Página inicial', href: '/admin/pagina-inicial' }] };
