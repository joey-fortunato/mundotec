import { Head } from '@inertiajs/react';
import { GraduationCap, Wrench } from 'lucide-react';

export default function Maintenance({ message, background }: { message?: string | null; background?: string | null }) {
    const bg = background || '/images/maintence.jpg';

    return (
        <>
            <Head title="Em manutenção" />

            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center text-white">
                {/* Imagem de fundo */}
                <div
                    className="absolute inset-0 -z-20 bg-[#0b1220] bg-cover bg-center"
                    style={{ backgroundImage: `url('${bg}')` }}
                />
                {/* Escurecimento para legibilidade */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220]/40 via-transparent to-[#0b1220]/80" />

                <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md sm:p-12">
                    <div className="flex items-center justify-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#1b2a63]">
                            <GraduationCap className="h-5 w-5" />
                        </span>
                        <span className="text-lg font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                            MundoTec
                        </span>
                    </div>

                    <div className="mx-auto mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20">
                        <Wrench className="h-9 w-9 animate-pulse" />
                    </div>

                    <h1
                        className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                        Estamos em manutenção
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-balance text-white/70">
                        {message?.trim()
                            ? message
                            : 'A nossa plataforma está a passar por melhorias e estará de volta em breve. Obrigado pela sua paciência.'}
                    </p>

                    <div className="mx-auto mt-8 h-px w-24 bg-white/15" />

                    <p className="mt-8 text-sm text-white/60">
                        Para assistência, contacte-nos através de{' '}
                        <a href="mailto:geral@mundotec.ao" className="font-medium text-white hover:underline">
                            geral@mundotec.ao
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
