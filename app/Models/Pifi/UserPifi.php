<?php

namespace App\Models\Pifi;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Laravel\Passport\HasApiTokens;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;



class UserPifi extends Authenticatable 
{
    use HasApiTokens;
    protected $table = 'user_pifis';
    protected $primaryKey = 'id'; 

    protected $fillable = [
        'reg-type',           
        'acceptMarketingCall',
        'acceptMarketingEmail',
        'acceptMarketingOther',
        'acceptMarketingSms',
        'acceptedTerms',
        'companyCountry',
        'companyName',
        'email',
        'firstName',
        'isPeps',
        'lastName',
        'password',        
        'phone',
        'phoneCountryCode',

        
    ];
}
