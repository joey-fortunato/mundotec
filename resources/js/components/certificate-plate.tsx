import { GraduationCap } from 'lucide-react';

type Cert = {
    serial: string;
    student: string;
    course: string;
    hours: number | null;
    issued_at: string;
};

export function CertificatePlate({ certificate }: { certificate: Cert }) {
    return (
        <div className="rounded-lg bg-white p-3 shadow-xl">
            <div className="rounded-sm border-2 border-primary p-0.5">
                <div className="rounded-sm border border-primary/30 px-8 py-10 text-center text-slate-900 sm:px-14">
                    <div className="flex items-center justify-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                            Mundo da Tecnologia
                        </span>
                    </div>

                    <div
                        className="mt-6 text-[13px] font-semibold tracking-[0.34em] text-primary"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                        CERTIFICADO DE CONCLUSÃO
                    </div>
                    <div className="mx-auto my-3.5 h-[3px] w-14 rounded bg-primary" />

                    <div className="text-sm text-slate-500">Certificamos que</div>
                    <div className="my-1.5 text-4xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                        {certificate.student}
                    </div>
                    <div className="text-sm text-slate-500">concluiu com aproveitamento o curso profissional</div>
                    <div className="my-2 text-2xl font-semibold text-primary" style={{ fontFamily: 'Sora, sans-serif' }}>
                        {certificate.course}
                    </div>
                    <div className="text-[13px] text-slate-500">
                        {certificate.hours ? `com a carga horária de ${certificate.hours} horas · ` : ''}
                        Luanda, {certificate.issued_at}
                    </div>

                    <div className="mt-11 flex items-end justify-between">
                        <div className="w-48 text-center">
                            <div className="border-t border-slate-300 pt-1.5 text-[11px] text-slate-400">Formador(a)</div>
                        </div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-center text-primary">
                            <div>
                                <div className="text-[9px] leading-none font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                                    INEFOP
                                </div>
                                <div className="text-[7px]">RECONHECIDO</div>
                            </div>
                        </div>
                        <div className="w-48 text-center">
                            <div className="border-t border-slate-300 pt-1.5 text-[11px] text-slate-400">
                                Direção Pedagógica
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
