import { useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CourseReviewForm({ slug }: { slug: string }) {
    const [hover, setHover] = useState(0);
    const { data, setData, post, processing, errors } = useForm({ rating: 0, comment: '' });
    return <div className="rounded-2xl border bg-card p-5 shadow-sm"><h2 className="font-semibold">Como foi a tua experiência?</h2><p className="mt-1 text-sm text-muted-foreground">A tua avaliação ajuda outros alunos a escolher.</p><div className="mt-3 flex gap-1">{[1, 2, 3, 4, 5].map(value => <button type="button" key={value} onMouseEnter={() => setHover(value)} onMouseLeave={() => setHover(0)} onClick={() => setData('rating', value)} aria-label={`${value} estrelas`} className="rounded p-1 transition-transform hover:scale-110 active:scale-95"><Star className={`h-6 w-6 ${(hover || data.rating) >= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`} /></button>)}</div>{errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating}</p>}<textarea className="mt-3 flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" value={data.comment} onChange={event => setData('comment', event.target.value)} placeholder="Partilha um comentário opcional…" /><Button className="mt-3" disabled={processing || !data.rating} onClick={() => post(`/cursos/${slug}/avaliacao`)}>Publicar avaliação</Button></div>;
}
