<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('wallet_gateway_1')->nullable();
            $table->string('wallet_address_1')->nullable();
            $table->string('wallet_gateway_2')->nullable();
            $table->string('wallet_address_2')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('wallet_gateway_1')->nullable();
            $table->string('wallet_address_1')->nullable();
            $table->string('wallet_gateway_2')->nullable();
            $table->string('wallet_address_2')->nullable();
        });
    }
}
