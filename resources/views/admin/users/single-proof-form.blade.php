@extends('admin.layouts.app')
@section('title')
    @lang('Proof')
@endsection
@section('content')

    <div class="m-0 m-md-4 my-4 m-md-0 shadow">
        <form method="post" action="{{ route('admin.send-proof') }}">
            @csrf
            <div class="col-sm-12">
                <div class="card card-primary">
                    <div class="card-body">
                        <h4 class="card-title"><i class="fas fa-envelope-open"></i> @lang('Send Proof To User') </h4>

                        <div class="form-group">
                            <label>@lang('Type of proof')</label>
                            
                            <select name="proof-type" id="" class="form-select">
                                <option value="withdrawal">Withdrawal</option>
                                <option value="deposit">Deposit</option>
                            </select>
                            @error('proof-type')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label>@lang('Amount')</label>
                            <input type="number" name="amount" value="{{old('amount')}}" placeholder="@lang('Write amount')" class="form-control" >
                            @error('amount')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label>@lang('Email')</label>
                            <input type="email" name="email" value="{{old('email')}}" placeholder="@lang('Write email')" class="form-control" >
                            @error('email')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label>@lang('Username')</label>
                            <input type="text" name="username" value="{{old('username')}}" placeholder="@lang('Write username')" class="form-control" >
                            @error('username')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        
                        <div class="form-group">
                            <label>@lang('Payment Method')</label>
                            <input type="text" name="method" value="{{old('method')}}" placeholder="@lang('Write method')" class="form-control" >
                            @error('method')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label>@lang('Transaction id')</label>
                            <input type="text" name="transaction-id" value="{{old('transaction-id')}}" placeholder="@lang('Write transaction id')" class="form-control" >
                            @error('transaction-id')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label>@lang('Feedback')</label>
                            <input type="text" name="feedback" value="{{old('feedback')}}" placeholder="@lang('Write feedback')" class="form-control" >
                            @error('feedback')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        
                        <div class="form-group">
                            <label>@lang('Charge')</label>
                            <input type="number" name="charge" value="{{old('charge')}}" placeholder="@lang('Write charge')" class="form-control" >
                            @error('charge')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label>@lang('Wallet address')</label>
                            <input type="text" name="address" value="{{old('address')}}" placeholder="@lang('Write address')" class="form-control" >
                            @error('address')
                            <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        
                       

                        <div class="submit-btn-wrapper mt-md-3 text-center text-md-left">
                            <button type="submit" class="btn waves-effect waves-light btn-rounded btn-primary btn-block"><span>@lang('Send Proof')</span> </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

@endsection


@push('style-lib')
    <link rel="stylesheet" href="{{ asset('assets/admin/css/summernote.min.css')}}">
@endpush
@push('js-lib')
    <script src="{{ asset('assets/admin/js/summernote.min.js')}}"></script>
@endpush
@push('js')
    <script>
        "use strict";

        $(document).ready(function() {
            $('#summernote').summernote({
                minHeight:220,
                callbacks: {
                            onBlurCodeview: function() {
                                let codeviewHtml = $(this).siblings('div.note-editor').find('.note-codable').val();
                                $(this).val(codeviewHtml);
                            }
                        }
            });
        });
    </script>
@endpush
