<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseReview extends Model
{
    protected $fillable = ['course_id', 'user_id', 'enrollment_id', 'rating', 'comment'];

    /** @return BelongsTo<Course, $this> */
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    /** @return BelongsTo<Enrollment, $this> */
    public function enrollment(): BelongsTo { return $this->belongsTo(Enrollment::class); }
}
