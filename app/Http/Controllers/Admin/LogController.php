<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use App\Models\ReferralBonus;
use App\Models\Transaction;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function transaction()
    {
        $transaction = Transaction::with('user')->orderBy('id', 'DESC')->paginate(config('basic.paginate'));
        return view('admin.transaction.index', compact('transaction'));
    }

    public function transactionSearch(Request $request)
    {
        $search = $request->all();
        $dateSearch = $request->datetrx;
        $date = preg_match("/^[0-9]{2,4}\-[0-9]{1,2}\-[0-9]{1,2}$/", $dateSearch);
        $transaction = Transaction::with('user')->orderBy('id', 'DESC')
            ->when(isset($search['transaction_id']), function ($query) use ($search) {
                return $query->where('trx_id', 'LIKE', "%{$search['transaction_id']}%");
            })
            ->when(isset($search['user_name']), function ($query) use ($search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('email', 'LIKE', "%{$search['user_name']}%")
                        ->orWhere('username', 'LIKE', "%{$search['user_name']}%");
                });
            })
            ->when(isset($search['remark']), function ($query) use ($search) {
                return $query->where('remarks', 'LIKE', "%{$search['remark']}%");
            })
            ->when($date == 1, function ($query) use ($dateSearch) {
                return $query->whereDate("created_at", $dateSearch);
            })
            ->paginate(config('basic.paginate'));
        $transaction =  $transaction->appends($search);
        return view('admin.transaction.index', compact('transaction'));
    }

    public function investments()
    {
        $investments = Investment::with('user','plan')->orderBy('id', 'DESC')->paginate(config('basic.paginate'));
        return view('admin.transaction.investLog', compact('investments'));
    }

    public function investmentsSearch(Request $request)
    {
        $search = $request->all();
        $dateSearch = $request->datetrx;
        $date = preg_match("/^[0-9]{2,4}\-[0-9]{1,2}\-[0-9]{1,2}$/", $dateSearch);
        $investments = Investment::orderBy('id', 'DESC')
            ->when(isset($search['user_name']), function ($query) use ($search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('email', 'LIKE', "%{$search['user_name']}%")
                        ->orWhere('username', 'LIKE', "%{$search['user_name']}%");
                });
            })
            ->when($date == 1, function ($query) use ($dateSearch) {
                return $query->whereDate("created_at", $dateSearch);
            })
            ->with('user','plan')->paginate(config('basic.paginate'));
        $investments =  $investments->appends($search);

        return view('admin.transaction.investLog', compact('investments'));
    }


    

    public function investmentsDelete(Request $request)
{
    // Check if user IDs are provided in the request
    if ($request->strIds == null) {
        session()->flash('error', 'You did not select any investments to delete.');
        return response()->json(['error' => 1]);
    }

    // Convert the comma-separated user IDs to an array
    // $userIds = explode(',', );

    try {
        // Use a transaction to ensure atomicity
        
            // Delete from the 'funds' table first
            Investment::whereIn('id', $request->strIds)->delete();                                                

            // Flash a success message
            session()->flash('success', 'Selected investments records have been deleted.');
        

        return response()->json(['success' => 1]);
    } catch (\Exception $e) {
        // Handle any exceptions that may occur during the transaction
        session()->flash('error', 'An error occurred while deleting users investments  records.');
        return response()->json(['error' => 1]);
    }
}

    public function commissions()
    {
        $transactions =  ReferralBonus::latest()->with('user','bonusBy:id,firstname,lastname')->paginate(config('basic.paginate'));
        return view('admin.transaction.commission', compact('transactions'));
    }

    public function commissionsSearch(Request $request)
    {
        $search = $request->all();
        $dateSearch = $request->datetrx;
        $date = preg_match("/^[0-9]{2,4}\-[0-9]{1,2}\-[0-9]{1,2}$/", $dateSearch);
        $transactions = ReferralBonus::orderBy('id', 'DESC')
            ->when(isset($search['user_name']), function ($query) use ($search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('email', 'LIKE', "%{$search['user_name']}%")
                        ->orWhere('username', 'LIKE', "%{$search['user_name']}%");
                });
            })
            ->when($date == 1, function ($query) use ($dateSearch) {
                return $query->whereDate("created_at", $dateSearch);
            })
            ->with('user','bonusBy:id,firstname,lastname')->paginate(config('basic.paginate'));
        $transactions =  $transactions->appends($search);
        return view('admin.transaction.commission', compact('transactions'));
    }


}
