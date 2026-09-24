import { useForm } from '@inertiajs/react';
import { Pencil, Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const LESSON_TYPES = [
    { value: 'video', label: 'Vídeo' },
    { value: 'text', label: 'Texto' },
    { value: 'pdf', label: 'PDF' },
];

export function AddLessonDialog({
    courseSlug,
    moduleId,
}: {
    courseSlug: string;
    moduleId: number;
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'video',
        video_url: '',
        video_file: null as File | null,
        attachment: null as File | null,
        content: '',
        duration_minutes: '',
        is_preview: false as boolean,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/courses/${courseSlug}/modules/${moduleId}/lessons`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar aula
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Nova aula</DialogTitle>
                        <DialogDescription>
                            Conteúdo em vídeo, texto ou PDF.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lesson-title">Título</Label>
                            <Input
                                id="lesson-title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                                autoFocus
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tipo</Label>
                            <Select
                                value={data.type}
                                onValueChange={(v) => setData('type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LESSON_TYPES.map((t) => (
                                        <SelectItem
                                            key={t.value}
                                            value={t.value}
                                        >
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {data.type === 'video' && (
                            <div className="grid gap-2">
                                <Label htmlFor="lesson-video">
                                    URL do vídeo
                                </Label>
                                <Input
                                    id="lesson-video"
                                    type="url"
                                    value={data.video_url}
                                    onChange={(e) =>
                                        setData('video_url', e.target.value)
                                    }
                                    placeholder="https://..."
                                />
                                <InputError message={errors.video_url} />
                                <Label htmlFor="lesson-video-file" className="mt-2">ou envia um ficheiro de vídeo</Label>
                                <Input id="lesson-video-file" type="file" accept="video/mp4,video/webm,video/ogg" onChange={(e) => setData('video_file', e.target.files?.[0] ?? null)} />
                                <InputError message={errors.video_file} />
                            </div>
                        )}
                        {data.type === 'pdf' && (
                            <div className="grid gap-2"><Label htmlFor="lesson-pdf">Ficheiro PDF</Label><Input id="lesson-pdf" type="file" accept="application/pdf" onChange={(e) => setData('attachment', e.target.files?.[0] ?? null)} /><InputError message={errors.attachment} /></div>
                        )}
                        {data.type === 'text' && (
                            <div className="grid gap-2">
                                <Label htmlFor="lesson-content">Conteúdo</Label>
                                <textarea
                                    id="lesson-content"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                                />
                                <InputError message={errors.content} />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="lesson-duration">
                                Duração (minutos, opcional)
                            </Label>
                            <Input
                                id="lesson-duration"
                                type="number"
                                min="0"
                                value={data.duration_minutes}
                                onChange={(e) =>
                                    setData('duration_minutes', e.target.value)
                                }
                            />
                            <InputError message={errors.duration_minutes} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="lesson-preview"
                                checked={data.is_preview}
                                onCheckedChange={(v) =>
                                    setData('is_preview', v === true)
                                }
                            />
                            <Label
                                htmlFor="lesson-preview"
                                className="font-normal"
                            >
                                Aula de pré-visualização (gratuita)
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Adicionar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditLessonDialog({ courseSlug, moduleId, lesson }: { courseSlug: string; moduleId: number; lesson: { id: number; title: string; type: string; is_preview: boolean } }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({ title: lesson.title, type: lesson.type, video_url: '', video_file: null as File | null, attachment: null as File | null, content: '', duration_minutes: '', is_preview: lesson.is_preview });
    return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Editar aula"><Pencil className="h-4 w-4" /></Button></DialogTrigger><DialogContent><form onSubmit={event => { event.preventDefault(); put(`/admin/courses/${courseSlug}/modules/${moduleId}/lessons/${lesson.id}`, { preserveScroll: true, onSuccess: () => setOpen(false) }); }}><DialogHeader><DialogTitle>Editar aula</DialogTitle><DialogDescription>Atualiza o conteúdo, tipo ou ficheiros da aula.</DialogDescription></DialogHeader><div className="grid gap-4 py-4"><div className="grid gap-2"><Label>Título</Label><Input value={data.title} onChange={event => setData('title', event.target.value)} /><InputError message={errors.title} /></div><div className="grid gap-2"><Label>Tipo</Label><Select value={data.type} onValueChange={value => setData('type', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{LESSON_TYPES.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent></Select></div>{data.type === 'video' && <div className="grid gap-2"><Label>URL externa</Label><Input type="url" value={data.video_url} onChange={event => setData('video_url', event.target.value)} placeholder="Mantém em branco para conservar" /><ModernFileInput label="Substituir vídeo" accept="video/mp4,video/webm,video/ogg" onFile={file => setData('video_file', file)} /></div>}{data.type === 'pdf' && <ModernFileInput label="Substituir PDF" accept="application/pdf" onFile={file => setData('attachment', file)} />}{data.type === 'text' && <textarea value={data.content} onChange={event => setData('content', event.target.value)} rows={5} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" placeholder="Novo conteúdo (deixa vazio para conservar)" />}<div className="flex items-center gap-2"><Checkbox checked={data.is_preview} onCheckedChange={value => setData('is_preview', value === true)} id={`preview-${lesson.id}`} /><Label htmlFor={`preview-${lesson.id}`}>Pré-visualização gratuita</Label></div></div><DialogFooter><Button type="submit" disabled={processing}>Guardar alterações</Button></DialogFooter></form></DialogContent></Dialog>;
}

export function ModernFileInput({ label, accept, onFile, multiple = false }: { label: string; accept: string; onFile: (file: File | null) => void; multiple?: boolean }) {
    const id = `upload-${label.replace(/\s/g, '-').toLowerCase()}`;
    return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><label htmlFor={id} className="group flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-primary/35 bg-primary/5 px-4 py-3 text-sm transition-all hover:border-primary hover:bg-primary/10 active:scale-[.99]"><span className="text-muted-foreground group-hover:text-primary">Selecionar ficheiro</span><Upload className="h-4 w-4 text-primary" /></label><input id={id} className="sr-only" type="file" accept={accept} multiple={multiple} onChange={event => onFile(event.target.files?.[0] ?? null)} /></div>;
}
