import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
                            </div>
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
