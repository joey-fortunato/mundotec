import { Form, Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
/* @chisel-registration */
import { register } from '@/routes';
/* @end-chisel-registration */
import { store } from '@/routes/login';
import { request } from '@/routes/password';
/* @chisel-passkeys */
import PasskeyVerify from '@/components/passkey-verify';
/* @end-chisel-passkeys */

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Entrar" />

            <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm">
                {/* @chisel-passkeys */}
                <PasskeyVerify label="Entrar com passkey" loadingLabel="A verificar…" separator="ou continuar com email" />
                {/* @end-chisel-passkeys */}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="nome@exemplo.com"
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Palavra-passe</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            Esqueceste-te?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember" className="font-normal">
                                    Manter sessão iniciada
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Entrar
                            </Button>
                        </>
                    )}
                </Form>
            </div>

            {/* @chisel-registration */}
            <div className="text-center text-sm text-muted-foreground">
                Ainda não tens conta?{' '}
                <TextLink href={register()} tabIndex={5}>
                    Criar conta
                </TextLink>
            </div>
            {/* @end-chisel-registration */}

            {status && (
                <div className="text-center text-sm font-medium text-green-600">{status}</div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Entrar na tua conta',
    description: 'Introduz o email e a palavra-passe.',
};
