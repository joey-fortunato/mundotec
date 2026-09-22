import { Head } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CONTACTS = [
    [MapPin, 'Moradas', 'Rangel, Vila Alice, Rua João de Deus, Luanda · Zango III, Primeira Paragem'],
    [Phone, 'Telefones', '932 407 153 · 922 900 498'],
    [Mail, 'Email', 'geral@mundotec.ao'],
    [Clock, 'Horário', 'Segunda a Sexta · 08h00 – 18h00'],
];

export default function Contactos() {
    return (
        <PublicLayout>
            <Head title="Contactos" />
            <PageHero eyebrow="Contactos" title="Fala connosco" subtitle="Estamos disponíveis para esclarecer as tuas dúvidas sobre cursos, estágios e treinamentos." />

            <section className="grid gap-8 py-12 lg:grid-cols-2">
                <div className="grid gap-4 sm:grid-cols-2">
                    {CONTACTS.map(([Icon, title, value]) => {
                        const I = Icon;

                        return (
                            <Card key={title as string}>
                                <CardContent className="pt-6">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <I className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-sm font-semibold">{title as string}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{value as string}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-lg font-semibold">Envia-nos uma mensagem</h2>
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="c-name">Nome</Label>
                                    <Input id="c-name" placeholder="O teu nome" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="c-phone">Telefone</Label>
                                    <Input id="c-phone" placeholder="9XX XXX XXX" />
                                </div>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="c-email">Email</Label>
                                <Input id="c-email" type="email" placeholder="nome@exemplo.com" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="c-msg">Mensagem</Label>
                                <textarea
                                    id="c-msg"
                                    rows={4}
                                    placeholder="Como podemos ajudar?"
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                />
                            </div>
                            <Button className="self-start">
                                <Send className="mr-2 h-4 w-4" /> Enviar mensagem
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </PublicLayout>
    );
}
