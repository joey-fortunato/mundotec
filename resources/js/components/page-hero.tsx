import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode }) {
    return (
        <section className="rounded-2xl bg-primary/5 px-6 py-12 text-center sm:px-10">
            {eyebrow && (
                <span className="text-xs font-semibold tracking-wide text-primary uppercase">{eyebrow}</span>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {subtitle && <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
            {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
        </section>
    );
}
