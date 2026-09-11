<?php

namespace App\Enums;

enum LessonType: string
{
    case Video = 'video';
    case Text = 'text';
    case Pdf = 'pdf';

    public function label(): string
    {
        return match ($this) {
            self::Video => 'Vídeo',
            self::Text => 'Texto',
            self::Pdf => 'PDF',
        };
    }
}
