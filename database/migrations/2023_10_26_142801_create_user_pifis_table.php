<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserPifisTable extends Migration
{
    public function up()
    {
        Schema::create('user_pifis', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->string('reg-type');
            $table->boolean('acceptMarketingCall')->default(true);
            $table->boolean('acceptMarketingEmail')->default(true);
            $table->boolean('acceptMarketingOther')->default(true);
            $table->boolean('acceptMarketingSms')->default(true);
            $table->boolean('acceptedTerms')->default(true);
            $table->string('companyCountry', 2)->default('ER');
            $table->string('companyName', 255)->default('f');
            $table->string('email', 255)->unique();;
            $table->string('firstName', 255)->default('fd');
            $table->boolean('isPeps')->default(true);
            $table->string('lastName', 255)->default('df');
            $table->string('password', 255);
            $table->string('personalId', 255);
            $table->string('phone', 15)->default('000');
            $table->string('phoneCountryCode', 5)->default('1');

            $table->string('verification_token');
            $table->boolean('status')->default(false);;         
            $table->boolean('verified')->default(false);;   
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_pifis');
    }
}
