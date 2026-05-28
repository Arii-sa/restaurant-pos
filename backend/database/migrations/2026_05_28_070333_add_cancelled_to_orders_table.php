<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('cancel_reason')->nullable()->after('status');
            $table->timestamp('cancelled_at')->nullable()->after('cancel_reason');
        });

        // statusのenum定義を変更
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending','cooking','served','completed','cancelled') DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['cancel_reason', 'cancelled_at']);
        });

        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending','cooking','served','completed') DEFAULT 'pending'");
    }
};

