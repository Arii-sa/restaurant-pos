<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $staff;
    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin    = User::factory()->create(['role' => 'admin']);
        $this->staff    = User::factory()->create(['role' => 'staff']);
        $this->category = Category::factory()->create(['name' => 'バーガー']);
    }

    public function test_can_get_products_list(): void
    {
        Product::factory()->count(3)->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->staff)
            ->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_admin_can_create_product(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/products', [
                'category_id'     => $this->category->id,
                'name'            => 'テストバーガー',
                'price'           => 800,
                'is_available'    => true,
                'is_customizable' => false,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'テストバーガー', 'price' => 800]);

        $this->assertDatabaseHas('products', ['name' => 'テストバーガー']);
    }

    public function test_product_creation_requires_name_and_price(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/products', [
                'category_id' => $this->category->id,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'price']);
    }

    public function test_admin_can_delete_product(): void
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_can_update_product_availability(): void
    {
        $product = Product::factory()->create([
            'category_id'  => $this->category->id,
            'is_available' => true,
        ]);

        $response = $this->actingAs($this->staff)
            ->patchJson("/api/products/{$product->id}/availability", [
                'is_available' => false,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('products', [
            'id'           => $product->id,
            'is_available' => false,
        ]);
    }
}
