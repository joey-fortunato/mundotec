<?php

namespace Database\Seeders;

use App\Enums\CourseStatus;
use App\Enums\LessonType;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoCoursesSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            'Marketing Digital & Design Gráfico' => [
                ['Marketing Digital do Zero', 'Aprende a vender e a criar presença online.', 55000],
                ['Design Gráfico com Canva e Photoshop', 'Cria peças profissionais para redes e impressão.', 60000],
            ],
            'Tecnologia' => [
                ['Cisco CCNA — Redes', 'Fundamentos de redes e preparação para a certificação CCNA.', 90000],
                ['Programação Web (HTML, CSS e JavaScript)', 'Constrói sites e aplicações do zero.', 75000],
            ],
            'Administrativos' => [
                ['Primavera ERP — Contabilidade', 'Domina o módulo de contabilidade do Primavera.', 65000],
            ],
        ];

        foreach ($catalog as $categoryName => $courses) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName],
            );

            foreach ($courses as [$title, $subtitle, $price]) {
                $course = Course::firstOrCreate(
                    ['slug' => Str::slug($title)],
                    [
                        'category_id' => $category->id,
                        'title' => $title,
                        'subtitle' => $subtitle,
                        'description' => "Curso prático e orientado para o mercado de trabalho.\n\nInclui acompanhamento e certificação reconhecida pelo INEFOP.",
                        'price' => $price,
                        'currency' => 'AOA',
                        'max_installments' => 3,
                        'level' => 'Iniciante',
                        'duration_minutes' => 1200,
                        'status' => CourseStatus::Published,
                        'published_at' => now(),
                    ],
                );

                if ($course->modules()->exists()) {
                    continue;
                }

                $intro = $course->modules()->create(['title' => 'Introdução', 'position' => 1]);
                $intro->lessons()->create([
                    'title' => 'Boas-vindas e visão geral',
                    'slug' => 'boas-vindas',
                    'type' => LessonType::Video,
                    'video_url' => 'https://example.com/intro',
                    'duration_minutes' => 8,
                    'position' => 1,
                    'is_preview' => true,
                ]);
                $intro->lessons()->create([
                    'title' => 'Como tirar o máximo do curso',
                    'slug' => 'como-aproveitar',
                    'type' => LessonType::Text,
                    'content' => 'Dicas para acompanhar as aulas.',
                    'duration_minutes' => 5,
                    'position' => 2,
                ]);

                $core = $course->modules()->create(['title' => 'Fundamentos', 'position' => 2]);
                foreach (['Conceitos essenciais', 'Prática guiada', 'Exercício final'] as $i => $lessonTitle) {
                    $core->lessons()->create([
                        'title' => $lessonTitle,
                        'slug' => Str::slug($lessonTitle),
                        'type' => LessonType::Video,
                        'video_url' => 'https://example.com/lesson',
                        'duration_minutes' => 15,
                        'position' => $i + 1,
                    ]);
                }
            }
        }
    }
}
