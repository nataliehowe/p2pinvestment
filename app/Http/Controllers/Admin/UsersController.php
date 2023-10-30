<?php

namespace App\Http\Controllers\Admin;

use App\Models\KYC;
use App\Models\Ranking;
use App\Models\User;
use App\Models\Fund;
use App\Models\Language;
use App\Models\PayoutLog;
use App\Http\Traits\Notify;
use App\Http\Traits\Upload;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Rules\FileTypeValidate;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Stevebauman\Purify\Facades\Purify;
use Illuminate\Support\Facades\Validator;


use Illuminate\Support\Facades\DB; // Import the DB class
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;
use App\Models\EmailTemplate;
use App\Models\Configure;


class UsersController extends Controller
{
    use Upload, Notify;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::guard('admin')->user();
            return $next($request);
        });
    }

    public function index()
    {
        $users = User::orderBy('id', 'DESC')->paginate(config('basic.paginate'));
        return view('admin.users.list', compact('users'));
    }

    public function search(Request $request)
    {
        $search = $request->all();
        $dateSearch = $request->date_time;
        $date = preg_match("/^[0-9]{2,4}\-[0-9]{1,2}\-[0-9]{1,2}$/", $dateSearch);
        $users = User::when(isset($search['search']), function ($query) use ($search) {
            return $query->where('email', 'LIKE', "%{$search['search']}%")
                ->orWhere('username', 'LIKE', "%{$search['search']}%");
        })
            ->when($date == 1, function ($query) use ($dateSearch) {
                return $query->whereDate("created_at", $dateSearch);
            })
            ->when(isset($search['status']), function ($query) use ($search) {
                return $query->where('status', $search['status']);
            })
            ->paginate(config('basic.paginate'));
        return view('admin.users.list', compact('users', 'search'));
    }


    public function activeMultiple(Request $request)
    {
        if ($request->strIds == null) {
            session()->flash('error', 'You do not select User.');
            return response()->json(['error' => 1]);
        } else {
            User::whereIn('id', $request->strIds)->update([
                'status' => 1,
            ]);
            session()->flash('success', 'User Status Has Been Active');
            return response()->json(['success' => 1]);
        }
    }

    public function deleteMultiple(Request $request)
{
    // Check if user IDs are provided in the request
    if ($request->strIds == null) {
        session()->flash('error', 'You did not select any users to delete.');
        return response()->json(['error' => 1]);
    }

    // Convert the comma-separated user IDs to an array
    // $userIds = explode(',', );

    try {
        // Use a transaction to ensure atomicity
        
            // Delete from the 'funds' table first
            Fund::whereIn('user_id', $request->strIds)->delete();

            // Delete users and related records
            User::whereIn('id', $request->strIds)->delete();
            
            // You can add more delete statements for other related records here
            // Example: UserProfile::whereIn('user_id', $userIds)->delete();

            // Flash a success message
            session()->flash('success', 'Selected users and their related records have been deleted.');
        

        return response()->json(['success' => 1]);
    } catch (\Exception $e) {
        // Handle any exceptions that may occur during the transaction
        session()->flash('error', 'An error occurred while deleting users and related records.');
        return response()->json(['error' => 1]);
    }
}


    public function inactiveMultiple(Request $request)
    {

        if ($request->strIds == null) {
            session()->flash('error', 'You do not select User.');
            return response()->json(['error' => 1]);
        } else {
            User::whereIn('id', $request->strIds)->update([
                'status' => 0,
            ]);

            session()->flash('success', 'User Status Has Been Deactive');
            return response()->json(['success' => 1]);

        }
    }


    public function userEdit($id)
    {
        $user = User::findOrFail($id);
        $data['allBadges'] = Ranking::orderBy('sort_by', 'ASC')->get();
        $languages = Language::all();
        return view('admin.users.edit-user', $data, compact('user','languages'));
    }

    public function userUpdate(Request $request, $id)
    {
        $languages = Language::all()->map(function ($item){
            return $item->id;
        });
        $userData = Purify::clean($request->except('_token', '_method'));
        $user = User::findOrFail($id);
        $rules = [
            'firstname' => 'sometimes|required',
            'lastname' => 'sometimes|required',
            'username' => 'sometimes|required|unique:users,username,' . $user->id,
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|required',
            'image' => ['nullable', 'image', new FileTypeValidate(['jpeg', 'jpg', 'png'])],
            'language_id' => Rule::in($languages),
        ];
        $message = [
            'firstname.required' => 'First Name is required',
            'lastname.required' => 'Last Name is required',
        ];

        $Validator = Validator::make($userData, $rules, $message);

        if ($Validator->fails()) {
            return back()->withErrors($Validator)->withInput();
        }

        if ($request->hasFile('image')) {
            try {
                $old = $user->image ?: null;
                $user->image = $this->uploadImage($request->image, config('location.user.path'), config('location.user.size'), $old);
            } catch (\Exception $exp) {
                return back()->with('error', 'Image could not be uploaded.');
            }
        }
        $user->firstname = $userData['firstname'];
        $user->lastname = $userData['lastname'];
        $user->username = $userData['username'];
        $user->email = $userData['email'];
        $user->phone = $userData['phone'];
        $user->language_id = $userData['language_id'];
        $user->address = $userData['address'];
        $user->status = ($userData['status'] == 'on') ? 0 : 1;
        $user->email_verification = ($userData['email_verification'] == 'on') ? 0 : 1;
        $user->sms_verification = ($userData['sms_verification'] == 'on') ? 0 : 1;
        $user->two_fa_verify = ($userData['two_fa_verify'] == 'on') ? 1 : 0;
        $user->save();

        $msg = [
            'user_name' => $user->fullname,
        ];

        $adminAction = [
            "link" => route('admin.user-edit',$user->id),
            "icon" => "fas fa-user text-white"
        ];

        $userAction = [
            "link" => route('user.profile'),
            "icon" => "fas fa-user text-white"
        ];

        $this->adminPushNotification('ADMIN_NOTIFY_WHEN_ADMIN_USER_UPDATE', $msg, $adminAction);
        $this->userPushNotification($user, 'USER_NOTIFY_WHEN_ADMIN_PROFILE_UPDATE', $msg, $userAction);

        $currentDate = dateTime(Carbon::now());
        $this->sendMailSms($user, $type = 'ADMIN_MAIL_WHEN_ADMIN_USER_UPDATE', [
            'name'          => $user->fullname,
            'date'          => $currentDate,
        ]);

        $this->mailToAdmin($type = 'USER_MAIL_WHEN_ADMIN_PROFILE_UPDATE', [
            'name' => $user->fullname,
            'date'  => $currentDate,
        ]);

        return back()->with('success', 'Updated Successfully.');
    }

    public function passwordUpdate(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|min:5|same:password_confirmation',
        ]);
        $user = User::findOrFail($id);
        $user->password = bcrypt($request->password);
        $user->save();

        $this->sendMailSms($user, 'PASSWORD_CHANGED', [
            'password' => $request->password
        ]);

        return back()->with('success', 'Updated Successfully.');
    }

    public function badgeUpdate(Request $request, $id){

        $badge = Ranking::findOrFail($request->badge_id);

        $user = User::findOrFail($id);
        $user->admin_update_badge = $request->badge_id;
        $user->last_lavel = $badge->rank_lavel;
        $user->save();


        $msg = [
            'user' => $user->fullname,
            'badge' => $user->last_lavel,
        ];

        $adminAction = [
            "link" => route('admin.users'),
            "icon" => "fa fa-user text-white"
        ];

        $userAction = [
            "link" => route('user.profile'),
            "icon" => "fa fa-user text-white"
        ];

        $this->userPushNotification($user, 'BADGE_NOTIFY_TO_USRE', $msg, $userAction);
        $this->adminPushNotification('BADGE_NOTIFY_TO_ADMIN', $msg, $adminAction);


        return back()->with('success', 'Updated Successfully.');
    }

    public function userBalanceUpdate(Request $request, $id)
    {
        $userData = Purify::clean($request->all());

        if ($userData['balance'] == null) {
            return back()->with('error', 'Balance Value Empty!');
        } else {
            $control = (object)config('basic');
            $user = User::findOrFail($id);
            
            if ($userData['walet'] == 'main_balance'){
                if ($userData['add_status'] == "1") {
                    $user->balance += $userData['balance'];
                    $user->save();

                    $transaction = new Transaction();
                    $transaction->user_id = $user->id;
                    $transaction->trx_type = '+';
                    $transaction->amount = $userData['balance'];
                    $transaction->charge = 0;
                    $transaction->remarks = 'Added Balance In Main Wallet';
                    $transaction->trx_id = strRandom();
                    $transaction->save();


                    $msg = [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->balance,
                        'transaction' => $transaction->trx_id
                    ];
                    $action = [
                        "link" => '#',
                        "icon" => "fa fa-money-bill-alt text-white"
                    ];

                    $this->userPushNotification($user, 'ADD_BALANCE', $msg, $action);


                    $this->sendMailSms($user, 'ADD_BALANCE', [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->balance,
                        'transaction' => $transaction->trx_id
                    ]);

                    return back()->with('success', 'Balance Add Successfully.');

                } else {

                    if ($userData['balance'] > $user->balance) {
                        return back()->with('error', 'Insufficient Balance to deducted.');
                    }
                    $user->balance -= $userData['balance'];
                    $user->save();


                    $transaction = new Transaction();
                    $transaction->user_id = $user->id;
                    $transaction->trx_type = '-';
                    $transaction->amount = $userData['balance'];
                    $transaction->charge = 0;
                    $transaction->remarks = 'Deducted Balance From Main Wallet';
                    $transaction->trx_id = strRandom();
                    $transaction->save();


                    $msg = [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->balance,
                        'transaction' => $transaction->trx_id
                    ];
                    $action = [
                        "link" => '#',
                        "icon" => "fa fa-money-bill-alt text-white"
                    ];

                    $this->userPushNotification($user, 'DEDUCTED_BALANCE', $msg, $action);

                    $this->sendMailSms($user, 'DEDUCTED_BALANCE', [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->balance,
                        'transaction' => $transaction->trx_id,
                    ]);
                    return back()->with('success', 'Balance deducted Successfully.');
                }
            } 
            
            if ($userData['walet'] == 'interest_balance'){

                if ($userData['add_status'] == "1") {
                    $user->interest_balance += $userData['balance'];
                    $user->save();

                    $transaction = new Transaction();
                    $transaction->user_id = $user->id;
                    $transaction->trx_type = '+';
                    $transaction->amount = $userData['balance'];
                    $transaction->charge = 0;
                    $transaction->remarks = 'Added Balance to Interest Wallet';
                    $transaction->trx_id = strRandom();
                    $transaction->save();


                    $msg = [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->interest_balance,
                        'transaction' => $transaction->trx_id
                    ];
                    $action = [
                        "link" => '#',
                        "icon" => "fa fa-money-bill-alt text-white"
                    ];

                    $this->userPushNotification($user, 'ADD_BALANCE', $msg, $action);


                    $this->sendMailSms($user, 'ADD_BALANCE', [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->interest_balance,
                        'transaction' => $transaction->trx_id
                    ]);

                    return back()->with('success', 'Balance Add Successfully.');

                } else {

                    if ($userData['balance'] > $user->interest_balance) {
                        return back()->with('error', 'Insufficient Balance to deducted.');
                    }
                    $user->interest_balance -= $userData['balance'];
                    $user->save();


                    $transaction = new Transaction();
                    $transaction->user_id = $user->id;
                    $transaction->trx_type = '-';
                    $transaction->amount = $userData['balance'];
                    $transaction->charge = 0;
                    $transaction->remarks = 'Deducted Balance from Interest Wallet';
                    $transaction->trx_id = strRandom();
                    $transaction->save();


                    $msg = [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->interest_balance,
                        'transaction' => $transaction->trx_id
                    ];
                    $action = [
                        "link" => '#',
                        "icon" => "fa fa-money-bill-alt text-white"
                    ];

                    $this->userPushNotification($user, 'DEDUCTED_BALANCE', $msg, $action);

                    $this->sendMailSms($user, 'DEDUCTED_BALANCE', [
                        'amount' => getAmount($userData['balance']),
                        'currency' => $control->currency,
                        'main_balance' => $user->interest_balance,
                        'transaction' => $transaction->trx_id,
                    ]);
                    return back()->with('success', 'Balance deducted Successfully.');
                }

            }
        }
    }


    public function emailToUsers()
    {
        return view('admin.users.mail-form');
    }

    public function sendEmailToUsers(Request $request)
    {
        $req = Purify::clean($request->except('_token', '_method'));
        $rules = [
            'subject' => 'sometimes|required',
            'message' => 'sometimes|required'
        ];
        $validator = Validator::make($req, $rules);
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        $allUsers = User::where('status', 1)->get();
        foreach ($allUsers as $user) {
            $this->mail($user, null, [], $req['subject'], $req['message']);
        }


        return back()->with('success', 'Mail Send Successfully');
    }


    public function sendEmail($id)
    {
        $user = User::findOrFail($id);
        return view('admin.users.single-mail-form', compact('user'));
    }

    public function sendProof()
    {
        // $user = User::findOrFail($id);
        return view('admin.users.single-proof-form');
    }

    public function sendMailUser(Request $request, $id)
    {
        $req = Purify::clean($request->except('_token', '_method'));
        $rules = [
            'subject' => 'sometimes|required',
            'message' => 'sometimes|required'
        ];
        $validator = Validator::make($req, $rules);
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        $user = User::findOrFail($id);
        $this->mail($user, null, [], $req['subject'], $req['message']);

        return back()->with('success', 'Mail Send Successfully');
    }


    public function sendProofUser(Request $request)
    {
        $req = Purify::clean($request->except('_token', '_method'));
        $basic = Configure::first();
        $currentDate = dateTime(Carbon::now());

        $rules = [
            'method' => 'sometimes|required',
            'amount' => 'sometimes|required'
        ];
        $validator = Validator::make($req, $rules);
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        // $user = User::findOrFail($id);
        
        $subject = null;
        $requestMessage = [];        

        if($req['proof-type'] == 'withdrawal'){
            $templateKey = 'USER_MAIL_PAYOUT_APPROVE';
            $params = [
                'method' => $req['method'],
                'amount' => $req['amount'],
                'charge' => $req['charge'],
                'currency' => $basic->currency,
                'transaction' => $req['transaction-id'],
                'feedback' => $req['feedback'],
                'date' => $currentDate
            ];
        } else {
            $templateKey = 'PAYMENT_APPROVED';
            $params = [
                'gateway_name' => $req['method'],
                'amount' => $req['amount'],
                'charge' => $req['charge'],
                'currency' => $basic->currency,
                'transaction' => $req['transaction-id'],
                'feedback' => $req['feedback'],
                'date' => $currentDate,                                                                
                                
            ];
        }
                                

        //.....
        $email_body = $basic->email_description;
                
        $templateObj = EmailTemplate::where('template_key', $templateKey)->where('mail_status', 1)->first();
        
        $message = str_replace("[[name]]", $req['username'], $email_body);

        if(!$templateObj && $subject == null){
           return false;
        }else{

            if ($templateObj) {
                $message = str_replace("[[message]]", $templateObj->template, $message);
                if (empty($message)) {
                    $message = $email_body;
                }
                foreach ($params as $code => $value) {
                    $message = str_replace('[[' . $code . ']]', $value, $message);
                }
            } else {
                $message = str_replace("[[message]]", $requestMessage, $message);
            }

            $subject = ($subject == null) ? $templateObj->subject : $subject;
            $email_from = ($templateObj) ? $templateObj->email_from : $basic->sender_email;

            @Mail::to($req['email'])->queue(new SendMail($email_from, $subject, $message));
            return back()->with('success', 'Proof Send Successfully');
        }
        //....
    }

    


    public function transaction($id)
    {
        $user = User::findOrFail($id);
        $userid = $user->id;
        $transaction = $user->transaction()->paginate(config('basic.paginate'));
        return view('admin.users.transactions', compact('user', 'userid', 'transaction'));
    }

    public function funds($id)
    {
        $user = User::findOrFail($id);
        $userid = $user->id;
        $funds = $user->funds()->paginate(config('basic.paginate'));
        return view('admin.users.fund-log', compact('user', 'userid', 'funds'));
    }

    public function investments($id)
    {
        $user = User::findOrFail($id);
        $userid = $user->id;
        $investments =  $user->invests()->paginate(config('basic.paginate'));
        return view('admin.users.investments', compact('user', 'userid', 'investments'));
    }
    public function payoutLog($id)
    {
        $user = User::findOrFail($id);
        $userid = $user->id;
        $records = PayoutLog::whereUser_id($user->id)->where('status', '!=', 0)->latest()->with('user', 'method')->paginate(config('basic.paginate'));
        return view('admin.users.payout-log', compact('user', 'userid', 'records'));
    }
    public function commissionLog($id)
    {
        $user = User::findOrFail($id);
        $userid = $user->id;
        $transactions = $user->referralBonusLog()->latest()->with('user','bonusBy:id,firstname,lastname')->paginate(config('basic.paginate'));
        return view('admin.users.commissionLog', compact('user', 'userid', 'transactions'));
    }

    public function referralMember($id)
    {
        $user = User::findOrFail($id);
        $referrals = getLevelUser($user->id);
        return view('admin.users.referral', compact('user', 'referrals'));
    }

    public function loginAsUser(Request $request, $id)
    {
        Auth::guard('web')->loginUsingId($id);
        return redirect()->route('user.home');
    }


    public function kycPendingList()
    {
        $title = "Pending KYC";
        $logs = KYC::orderBy('id', 'DESC')->where('status',0)->with(['user','admin'])->paginate(config('basic.paginate'));
        return view('admin.users.kycList', compact('logs','title'));
    }
    public function kycList()
    {
        $title = "KYC Log";
        $logs = KYC::orderBy('id', 'DESC')->where('status','!=',0)->paginate(config('basic.paginate'));
        return view('admin.users.kycList', compact('logs','title'));
    }

    public function userKycHistory(User $user)
    {
        $title = $user->username." : KYC Log";
        $logs = KYC::orderBy('id', 'DESC')->where('user_id',$user->id)->paginate(config('basic.paginate'));
        return view('admin.users.kycList', compact('logs','title'));
    }


    public function kycAction(Request $request, $id)
    {

        $this->validate($request, [
            'id' => 'required',
            'status' => ['required', Rule::in(['1', '2'])],
        ]);
        $data = KYC::where('id', $request->id)->whereIn('status', [0])->with('user')->firstOrFail();
        $basic = (object) config('basic');

        if ($request->status == '1') {
            $data->status = 1;
            $data->admin_id = auth()->guard('admin')->id();
            $data->update();
            $user = $data->user;
            if($data->kyc_type == 'address-verification'){
                $user->address_verify = 2;
            }else{
                $user->identity_verify = 2;
            }
            $user->save();

            $userMsg = [
                'kyc_type' => kebab2Title($data->kyc_type)
            ];

            $adminMsg = [
                'user_name' => $user->fullname,
                'kyc_type' => kebab2Title($data->kyc_type)
            ];

            $adminAction = [
                "link" => route('admin.kyc.users'),
                "icon" => "fas fa-file-alt text-white"
            ];

            $userAction = [
                "link" => '#',
                "icon" => "fas fa-file-alt text-white"
            ];

            $this->adminPushNotification('ADMIN_NOTIFY_KYC_APPROVED', $adminMsg, $adminAction);
            $this->userPushNotification($user, 'USER_NOTIFY_KYC_APPROVED', $userMsg, $userAction);

            $currentDate = dateTime(Carbon::now());
            $this->sendMailSms($user, $type = 'USER_MAIL_KYC_APPROVED', [
                'kyc_type' => kebab2Title($data->kyc_type),
                'date'  => $currentDate
            ]);

            $this->mailToAdmin($type = 'ADMIN_MAIL_KYC_APPROVED', [
                'user_name' => $user->fullname,
                'kyc_type'  => kebab2Title($data->kyc_type),
                'date'      => $currentDate
            ]);

            session()->flash('success', 'Approve Successfully');
            return back();

        }
        elseif ($request->status == '2') {
            $data->status = 2;
            $data->admin_id = auth()->guard('admin')->id();
            $data->update();

            $user = $data->user;
            if($data->kyc_type == 'address-verification'){
                $user->address_verify = 3;
            }else{
                $user->identity_verify = 3;
            }
            $user->save();

            $userMsg = [
                'kyc_type' => kebab2Title($data->kyc_type)
            ];

            $adminMsg = [
                'user_name' => $user->fullname,
                'kyc_type'  => kebab2Title($data->kyc_type)
            ];

            $adminAction = [
                "link" => route('admin.kyc.users'),
                "icon" => "fas fa-file-alt text-white"
            ];

            $userAction = [
                "link" => '#',
                "icon" => "fas fa-file-alt text-white"
            ];

            $this->adminPushNotification('ADMIN_NOTIFY_KYC_REJECTED', $adminMsg, $adminAction);
            $this->userPushNotification($user, 'USER_NOTIFY_KYC_REJECTED', $userMsg, $userAction);

            $currentDate = dateTime(Carbon::now());
            $this->sendMailSms($user, $type = 'USER_MAIL_KYC_REJECTED', [
                'kyc_type' => kebab2Title($data->kyc_type),
                'date'  => $currentDate
            ]);

            $this->mailToAdmin($type = 'ADMIN_MAIL_KYC_REJECTED', [
                'user_name'  => $user->fullname,
                'kyc_type'  => kebab2Title($data->kyc_type),
                'date'      => $currentDate
            ]);

            session()->flash('success', 'Reject Successfully');
            return back();
        }
    }


}
