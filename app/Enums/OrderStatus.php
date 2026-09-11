<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case PartiallyPaid = 'partially_paid';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendente',
            self::PartiallyPaid => 'Parcialmente paga',
            self::Paid => 'Paga',
            self::Cancelled => 'Cancelada',
            self::Refunded => 'Reembolsada',
        };
    }
}
