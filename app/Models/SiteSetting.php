<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    /** @return array<mixed> */
    public static function valueFor(string $key, array $default = []): array
    {
        return static::query()->where('key', $key)->first()?->value ?? $default;
    }

    /** @param array<mixed> $value */
    public static function put(string $key, array $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
