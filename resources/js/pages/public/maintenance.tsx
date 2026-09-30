import { Head } from '@inertiajs/react';
import { GraduationCap, Wrench } from 'lucide-react';

export default function Maintenance({ message }: { message?: string | null }) {
    return (
        <>
            <Head title="Em manutenção" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <GraduationCap className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                        MundoTec
                    </span>
                </div>

                <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Wrench className="h-9 w-9" />
                </div>

                <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Estamos em manutenção
                </h1>

                <p className="mt-4 max-w-md text-balance text-muted-foreground">
                    {message?.trim()
                        ? message
                        : 'A nossa plataforma está a passar por melhorias e estará de volta em breve. Obrigado pela sua paciência.'}
                </p>

                <p className="mt-10 text-sm text-muted-foreground">
                    Para assistência, contacte-nos através de{' '}
                    <a href="mailto:geral@mundotec.ao" className="font-medium text-primary hover:underline">
                        geral@mundotec.ao
                    </a>
                </p>
            </div>
        </>
    );
}
