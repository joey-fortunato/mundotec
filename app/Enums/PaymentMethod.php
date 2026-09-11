<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case BankTransfer = 'bank_transfer';
    case MulticaixaExpress = 'multicaixa_express';
    case Cash = 'cash';

    public function label(): string
    {
        return match ($this) {
            self::BankTransfer => 'Transferência bancária',
            self::MulticaixaExpress => 'Multicaixa Express',
            self::Cash => 'Numerário',
        };
    }
}
