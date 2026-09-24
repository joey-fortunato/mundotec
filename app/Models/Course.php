<?php

namespace App\Models;

use App\Enums\CourseStatus;
use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int|null $category_id
 * @property int|null $instructor_id
 * @property string $title
 * @property string $slug
 * @property string|null $subtitle
 * @property string|null $description
 * @property string|null $thumbnail_path
 * @property string $price
 * @property string $currency
 * @property int $max_installments
 * @property string|null $level
 * @property int|null $duration_minutes
 * @property CourseStatus $status
 * @property Carbon|null $published_at
 */
class Course extends Model
{
    /** @use HasFactory<CourseFactory> */
    use HasFactory;

    protected $fillable = [
        'category_id', 'instructor_id', 'title', 'slug', 'subtitle',
        'description', 'thumbnail_path', 'price', 'currency', 'max_installments',
        'level', 'duration_minutes', 'status', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'status' => CourseStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** @return BelongsTo<User, $this> */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /** @return HasMany<Module, $this> */
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('position');
    }

    /** @return HasManyThrough<Lesson, Module, $this> */
    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(Lesson::class, Module::class);
    }

    /** @return HasMany<Enrollment, $this> */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    /** @return HasMany<CourseReview, $this> */
    public function reviews(): HasMany
    {
        return $this->hasMany(CourseReview::class);
    }

    /** @param  Builder<Course>  $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', CourseStatus::Published);
    }

    public function thumbnailUrl(): ?string
    {
        return $this->thumbnail_path
            ? Storage::url($this->thumbnail_path)
            : null;
    }
}
