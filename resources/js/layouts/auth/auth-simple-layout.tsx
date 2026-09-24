import { Link } from '@inertiajs/react';
import { Award, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="auth-scene flex min-h-svh flex-col items-center justify-center gap-6 overflow-x-hidden bg-background p-6 md:p-10">
            <div className="auth-orbit auth-orbit-one" aria-hidden="true"><GraduationCap /></div>
            <div className="auth-orbit auth-orbit-two" aria-hidden="true"><BookOpen /></div>
            <div className="auth-orbit auth-orbit-three" aria-hidden="true"><Award /></div>
            <div className="auth-spark auth-spark-one" aria-hidden="true"><Sparkles /></div>
            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium transition-transform hover:scale-[1.03] active:scale-[.97]"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                                <AppLogoIcon className="size-6 fill-current text-primary-foreground" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
