import { GraduationCap } from 'lucide-react';

type Cert = {
    serial: string;
    student: string;
    course: string;
    hours: number | null;
    issued_at: string;
    design?: { title: string; city: string; signatory: string; trainer_label: string; accent_color?: string; border_style?: string; shape?: string; logo_url?: string; background_url?: string; seal_url?: string };
};

export function CertificatePlate({ certificate }: { certificate: Cert }) {
    const design = certificate.design ?? { title: 'CERTIFICADO DE CONCLUSÃO', city: 'Luanda', signatory: 'Direção Pedagógica', trainer_label: 'Formador(a)' };
    const accent = design.accent_color ?? '#2447c8';
    return (
        <div className="rounded-lg bg-white p-3 shadow-xl" style={{ backgroundImage: design.background_url ? `linear-gradient(rgb(255 255 255 / .86), rgb(255 255 255 / .9)), url(${design.background_url})` : undefined, backgroundSize: 'cover' }}>
            <div className={`${design.border_style === 'single' ? 'border-2' : design.border_style === 'modern' ? 'border-x-8 border-y-2' : 'border-4'} rounded-sm p-0.5`} style={{ borderColor: accent }}>
                <div className="rounded-sm border px-8 py-10 text-center text-slate-900 sm:px-14" style={{ borderColor: `${accent}55` }}>
                    <div className="flex items-center justify-center gap-2.5">
                        {design.logo_url ? <img src={design.logo_url} alt="Logótipo" className="h-10 w-10 rounded-lg object-contain" /> : <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: accent }}>
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>}
                        <span className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                            Mundo da Tecnologia
                        </span>
                    </div>

                    <div
                        className="mt-6 text-[13px] font-semibold tracking-[0.34em]"
                        style={{ color: accent, fontFamily: 'Sora, sans-serif' }}
                    >
                        {design.title}
                    </div>
                    <div className="mx-auto my-3.5 h-[3px] w-14 rounded" style={{ backgroundColor: accent }} />

                    <div className="text-sm text-slate-500">Certificamos que</div>
                    <div className="my-1.5 text-4xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                        {certificate.student}
                    </div>
                    <div className="text-sm text-slate-500">concluiu com aproveitamento o curso profissional</div>
                    <div className="my-2 text-2xl font-semibold" style={{ color: accent, fontFamily: 'Sora, sans-serif' }}>
                        {certificate.course}
                    </div>
                    <div className="text-[13px] text-slate-500">
                        {certificate.hours ? `com a carga horária de ${certificate.hours} horas · ` : ''}
                        {design.city}, {certificate.issued_at}
                    </div>

                    <div className="mt-11 flex items-end justify-between">
                        <div className="w-48 text-center">
                            <div className="border-t border-slate-300 pt-1.5 text-[11px] text-slate-400">{design.trainer_label}</div>
                        </div>
                        {design.seal_url ? <img src={design.seal_url} alt="Selo" className={`h-16 w-16 object-contain ${design.shape === 'diamond' ? 'rotate-45' : design.shape === 'circle' ? 'rounded-full' : ''}`} /> : <div className={`flex h-16 w-16 items-center justify-center border-2 text-center ${design.shape === 'diamond' ? 'rotate-45' : design.shape === 'circle' ? 'rounded-full' : 'rounded-full'}`} style={{ borderColor: accent, color: accent }}>
                            <div>
                                <div className="text-[9px] leading-none font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    INEFOP
                                </div>
                                <div className="text-[7px]">RECONHECIDO</div>
                            </div>
                        </div>}
                        <div className="w-48 text-center">
                            <div className="border-t border-slate-300 pt-1.5 text-[11px] text-slate-400">
                                {design.signatory}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
                        Verifica a autenticidade em mundotec.ao/verificar · ID: {certificate.serial}
                    </div>
                </div>
            </div>
        </div>
    );
}
