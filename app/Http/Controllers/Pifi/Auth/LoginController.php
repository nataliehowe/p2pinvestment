<?php

namespace App\Http\Controllers\Pifi\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pifi\UserPifi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Import the Log facade


class LoginController extends Controller
{
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            
            if (Auth::attempt($credentials)) {
                $user = Auth::user();
                // $token = $user->createToken('MyApp');
                $token = base64_encode(openssl_random_pseudo_bytes(32));
        
                return response()->json([
                    'message' => 'Login successful',
                    'access_token' => $token,
                    'result' => [
                        "is_company" => false,
                        "email" => "natalie.howe212@gmail.com",
                        'investor_id' => 44640,
                        'pay_sys_settings' => [
                            [
                                'pay_sys_id' => 70,
                                'cashout_min_amount' => "0",
                                'is_cashout_allowed' => 1,
                                'currency_code_digits' => 946,
                                'deposit_min_amount' => "0",
                                'deposit_fee_money' => "0",
                                'cashout_fee_amount' => "0",
                                'cashout_fee_perc' => "0",
                                'deposit_fee_pct' => "0",
                                'currency_code' => "RON",
                                'currency_id' => 1116,
                                'pay_type' => null,
                                'cashout_max_amount' => "9999999",
                                'deposit_max_amount' => "9999999",
                                'is_deposit_allowed' => 1,
                            ],
                            [
                                'pay_sys_id' => 55,
                                'cashout_min_amount' => "0",
                                'is_cashout_allowed' => 1,
                                'currency_code_digits' => 946,
                                'deposit_min_amount' => "0",
                                'deposit_fee_money' => "0",
                                'cashout_fee_amount' => "0",
                                'cashout_fee_perc' => "0",
                                'currency_code' => "RON",
                                'deposit_fee_pct' => "0",
                                'currency_id' => 1116,
                                'pay_type' => null,
                                'cashout_max_amount' => "9999999",
                                'is_deposit_allowed' => 1,
                                'deposit_max_amount' => "9999999",
                            ],
                            [
                                'cashout_fee_amount' => "0",
                                'cashout_fee_perc' => "0",
                                'currency_code' => "BGN",
                                'deposit_fee_pct' => "0",
                                'pay_type' => null,
                                'currency_id' => 1028,
                                'cashout_max_amount' => "9999999",
                                'is_deposit_allowed' => 1,
                                'deposit_max_amount' => "9999999",
                                'pay_sys_id' => 25,
                                'cashout_min_amount' => "0",
                                'is_cashout_allowed' => 1,
                                'currency_code_digits' => 975,
                                'deposit_min_amount' => "0",
                                'deposit_fee_money' => "0",
                            ],
                            [
                                'deposit_fee_pct' => "0",
                                'cashout_fee_perc' => "0",
                                'currency_code' => "PLN",
                                'pay_type' => null,
                                'currency_id' => 1164,
                                'cashout_fee_amount' => "0",
                                'is_deposit_allowed' => 1,
                                'deposit_max_amount' => "9999999",
                                'cashout_max_amount' => "9999999",
                                'cashout_min_amount' => "0",
                                'pay_sys_id' => 130,
                                'deposit_fee_money' => "0",
                                'is_cashout_allowed' => 1,
                                'deposit_min_amount' => "0",
                                'currency_code_digits' => 985,
                            ],
                            [
                                'cashout_max_amount' => "9999999",
                                'is_deposit_allowed' => 1,
                                'deposit_max_amount' => "9999999",
                                'cashout_fee_amount' => "0",
                                'currency_id' => 1004,
                                'pay_type' => null,
                                'cashout_fee_perc' => "0",
                                'deposit_fee_pct' => "0",
                                'currency_code' => "EUR",
                                'currency_code_digits' => 978,
                                'deposit_min_amount' => "0",
                                'is_cashout_allowed' => 1,
                                'deposit_fee_money' => "0",
                                'pay_sys_id' => 60,
                                'cashout_min_amount' => "0",
                            ],
                            [
                                'deposit_fee_money' => "0",
                                'is_cashout_allowed' => 1,
                                'currency_code_digits' => 975,
                                'deposit_min_amount' => "0",
                                'cashout_min_amount' => "0",
                                'pay_sys_id' => 45,
                                'is_deposit_allowed' => 1,
                                'deposit_max_amount' => "9999999",
                                'cashout_max_amount' => "9999999",
                                'currency_code' => "BGN",
                                'cashout_fee_perc' => "0",
                                'deposit_fee_pct' => "0",
                                'currency_id' => 1028,
                                'pay_type' => null,
                                'cashout_fee_amount' => "0",
                            ],
                            [
                                'cashout_fee_amount' => "0",
                                'currency_code' => "EUR",
                                'cashout_fee_perc' => "0",
                                'deposit_fee_pct' => "0",
                                'pay_type' => null,
                                'currency_id' => 1004,
                                'cashout_max_amount' => "9999999",
                                'deposit_max_amount' => "9999999",
                                'is_deposit_allowed' => 1,
                                'pay_sys_id' => 40,
                                'cashout_min_amount' => "0",
                                'is_cashout_allowed' => 1,
                                'deposit_min_amount' => "0",
                                'currency_code_digits' => 978,
                                'deposit_fee_money' => "0",
                            ],
                            [
                                'is_deposit_allowed' => 1,
                                'deposit_max_amount' => "9999999",
                                'cashout_max_amount' => "9999999",
                                'pay_type' => null,
                                'currency_id' => 1117,
                                'deposit_fee_pct' => "0",
                                'cashout_fee_perc' => "0",
                                'currency_code' => "RUB",
                                'cashout_fee_amount' => "0",
                                'deposit_fee_money' => "0",
                                'currency_code_digits' => 643,
                                'deposit_min_amount' => "0",
                                'is_cashout_allowed' => 1,
                                'cashout_min_amount' => "0",
                                'pay_sys_id' => 151,
                            ],
                            [
                                'pay_sys_id' => 120,
                                'cashout_min_amount' => "0",
                                'is_cashout_allowed' => 0,
                                'currency_code_digits' => 946,
                                'deposit_min_amount' => "4",
                                'deposit_fee_money' => "0",
                                'cashout_fee_amount' => "0",
                                'deposit_fee_pct' => "2.3",
                                'cashout_fee_perc' => "0",
                                'currency_code' => "RON",
                                'pay_type' => "TRUSTLY",
                                'currency_id' => 1116,
                                'cashout_max_amount' => "0",
                                'deposit_max_amount' => "10000000",
                                'is_deposit_allowed' => 1,
                            ],
                        ],
                        'status' => [
                            'status' => 'ok',
                        ],
                        'session_token' => 'd96b66d5a006e6d68d70f95ee80aa9ef',
                        'token_expiration_seconds' => 300,
                        'token_expiration_timestamp' => '2023-10-30 13:07:39+02',
                    ],
                ]);
            } else {
                // Log the failed login attempt for debugging
                Log::error('Failed login attempt for email: ' . $request->input('email'));
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        
        } catch (\Illuminate\Auth\AuthenticationException $e) {
            return response()->json(['error' => 'Authentication failed.'], 401);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Login failed. Please try again.'], 500);
        }
    }
    
}

