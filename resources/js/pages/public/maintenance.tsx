import { Head } from '@inertiajs/react';
import { GraduationCap, Mail, Wrench } from 'lucide-react';

export default function Maintenance({ message, background }: { message?: string | null; background?: string | null }) {
    const bg = background || '/images/maintence.jpg';
    const year = new Date().getFullYear();

    return (
        <>
            <Head title="Em manutenção" />

            <div className="flex min-h-screen flex-col bg-[#0b1220] text-white lg:flex-row">
                {/* Coluna de conteúdo */}
                <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#1b2a63]">
                            <GraduationCap className="h-5 w-5" />
                        </span>
                        <span className="text-lg font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
                            MundoTec
                        </span>
                    </div>

                    {/* Banner da imagem (apenas em telemóvel) */}
                    <div
                        className="mt-8 h-44 w-full rounded-2xl bg-[#0b1220] bg-cover bg-center ring-1 ring-white/10 lg:hidden"
                        style={{ backgroundImage: `url('${bg}')` }}
                    />

                    {/* Bloco central */}
                    <div className="flex flex-1 flex-col justify-center py-10">
                        <div className="max-w-xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 uppercase">
                                <Wrench className="h-3.5 w-3.5 animate-pulse" />
                                Em manutenção
                            </span>

                            <h1
                                className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl"
                                style={{ fontFamily: 'Sora, sans-serif' }}
                            >
                                Estamos a melhorar a plataforma
                            </h1>

                            <p className="mt-5 text-lg text-balance text-white/70">
                                {message?.trim()
                                    ? message
                                    : 'A nossa plataforma está a passar por melhorias e estará de volta em breve. Obrigado pela sua paciência.'}
                            </p>

                            <div className="mt-8 h-px w-24 bg-white/15" />

                            <a
                                href="mailto:geral@mundotec.ao"
                                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                            >
                                <Mail className="h-4 w-4" />
                                geral@mundotec.ao
                            </a>
                        </div>
                    </div>

                    {/* Rodapé */}
                    <div className="text-xs text-white/40">© {year} Mundo da Tecnologia. Todos os direitos reservados.</div>
                </div>

                {/* Coluna da imagem (desktop) */}
                <div className="relative hidden lg:block lg:w-[44%] xl:w-2/5">
                    <div className="absolute inset-0 bg-[#0b1220] bg-cover bg-center" style={{ backgroundImage: `url('${bg}')` }} />
                    {/* Esbatimento para fundir com a coluna de conteúdo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/60 to-transparent" />
                </div>
            </div>
        </>
    );
}
