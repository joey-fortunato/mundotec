<?php

namespace App\Models;

use App\Enums\LessonType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $module_id
 * @property string $title
 * @property string $slug
 * @property LessonType $type
 * @property string|null $content
 * @property string|null $video_url
 * @property string|null $attachment_path
 * @property int|null $duration_minutes
 * @property int $position
 * @property bool $is_preview
 */
class Lesson extends Model
{
    /** @use HasFactory<\Database\Factories\LessonFactory> */
    use HasFactory;

    protected $fillable = [
        'module_id', 'title', 'slug', 'type', 'content', 'video_url',
        'attachment_path', 'duration_minutes', 'position', 'is_preview',
    ];

    protected function casts(): array
    {
        return [
            'type' => LessonType::class,
            'is_preview' => 'boolean',
            'position' => 'integer',
        ];
    }

    /** @return BelongsTo<Module, $this> */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /** @return HasMany<LessonProgress, $this> */
    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }
}
