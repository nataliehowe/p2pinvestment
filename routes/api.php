<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
use  App\Http\Controllers\Pifi\Auth\LoginController;

Route::middleware('api')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
});

use  App\Http\Controllers\Pifi\UserPifiController;


// Route to create a new UserPifi
// Route::post('/userpifi', 'Pifi\UserPifiController@create')->name('create-user');
Route::post('/userpifi', [UserPifiController::class, 'create']);




// Route to update a UserPifi by ID
Route::put('/userpifi/{id}', [UserPifiController::class, 'update']);

// Route to view a UserPifi by ID
Route::get('/userpifi/{id}', [UserPifiController::class, 'view']);