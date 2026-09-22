<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnrollmentPaymentTest extends TestCase
{
    use RefreshDatabase;

    private function publishedCourse(int $price = 90000, int $maxInstallments = 3): Course
    {
        return Course::factory()->create([
            'status' => CourseStatus::Published,
            'published_at' => now(),
            'price' => $price,
            'max_installments' => $maxInstallments,
        ]);
    }

    public function test_guests_cannot_enroll(): void
    {
        $course = $this->publishedCourse();

        $this->get("/cursos/{$course->slug}/inscrever")->assertRedirect(route('login'));
    }

    public function test_student_can_enroll_and_an_order_is_created(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->publishedCourse();

        $this->actingAs($student)
            ->post("/cursos/{$course->slug}/inscrever", ['installments' => 3])
            ->assertRedirect();

        $enrollment = Enrollment::first();
        $this->assertNotNull($enrollment);
        $this->assertSame(EnrollmentStatus::Pending, $enrollment->status);

        $order = $enrollment->orders()->first();
        $this->assertNotNull($order);
        $this->assertSame(OrderStatus::Pending, $order->status);
        $this->assertSame(3, $order->installments);
        $this->assertSame('90000.00', $order->total);
    }

    public function test_student_can_initiate_a_multicaixa_payment(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->publishedCourse();

        $this->actingAs($student)->post("/cursos/{$course->slug}/inscrever", ['installments' => 1]);
        $enrollment = Enrollment::first();

        $this->actingAs($student)
            ->post("/matriculas/{$enrollment->id}/pagamento", ['phone' => '923 000 000'])
            ->assertRedirect();

        $payment = Payment::first();
        $this->assertNotNull($payment);
        $this->assertSame(PaymentStatus::Pending, $payment->status);
        $this->assertSame(PaymentMethod::MulticaixaExpress, $payment->method);
        $this->assertSame('923000000', $payment->gateway_payload['phone']);
    }

    public function test_payment_requires_a_valid_phone(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->publishedCourse();
        $this->actingAs($student)->post("/cursos/{$course->slug}/inscrever", ['installments' => 1]);
        $enrollment = Enrollment::first();

        $this->actingAs($student)
            ->post("/matriculas/{$enrollment->id}/pagamento", ['phone' => '123'])
            ->assertSessionHasErrors('phone');
    }

    public function test_a_student_cannot_view_another_students_payment(): void
    {
        $owner = User::factory()->create(['role' => UserRole::Student]);
        $intruder = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->publishedCourse();

        $this->actingAs($owner)->post("/cursos/{$course->slug}/inscrever", ['installments' => 1]);
        $enrollment = Enrollment::first();

        $this->actingAs($intruder)->get("/matriculas/{$enrollment->id}/pagamento")->assertForbidden();
    }

    public function test_admin_confirmation_activates_the_enrollment(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->publishedCourse(price: 60000, maxInstallments: 1);

        $this->actingAs($student)->post("/cursos/{$course->slug}/inscrever", ['installments' => 1]);
        $enrollment = Enrollment::first();
        $this->actingAs($student)->post("/matriculas/{$enrollment->id}/pagamento", [
            'phone' => '923 000 000',
        ]);

        $payment = Payment::first();

        $this->actingAs($admin)
            ->post("/admin/pagamentos/{$payment->id}/confirmar")
            ->assertRedirect();

        $payment->refresh();
        $enrollment->refresh();

        $this->assertSame(PaymentStatus::Confirmed, $payment->status);
        $this->assertSame($admin->id, $payment->confirmed_by);
        $this->assertSame(OrderStatus::Paid, $payment->order->status);
        $this->assertSame(EnrollmentStatus::Active, $enrollment->status);
        $this->assertSame('60000.00', $enrollment->price_paid);
    }

    public function test_students_cannot_access_the_admin_payments_screen(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);

        $this->actingAs($student)->get('/admin/pagamentos')->assertForbidden();
    }
}
