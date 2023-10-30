<?php

namespace App\Http\Controllers\Pifi;

use App\Http\Controllers\Controller;
use App\Models\Pifi\UserPifi;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use App\Mail\PifiEmail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;


class UserPifiController extends Controller
{
    
    public function create(Request $request)
    {
        try {
            // Define validation rules for the fields you want to validate
            $validationRules = [
            'email' => 'required|email|unique:user_pifis,email',
            
            'password' => 'required',
            'acceptMarketingCall' => 'nullable|boolean',
            'acceptMarketingEmail' => 'nullable|boolean',
            'acceptMarketingOther' => 'nullable|boolean',
            'acceptMarketingSms' => 'nullable|boolean',
            'acceptedTerms' => 'nullable|boolean',
            'companyCountry' => 'nullable|string|size:2',
            'companyName' => 'nullable|string|max:255',
            'firstName' => 'nullable|string|max:255',
            'isPeps' => 'nullable|boolean',
            'lastName' => 'nullable|string|max:255',
            'personalId' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:15',
            'phoneCountryCode' => 'nullable|string|max:5',         
            ];
    
            $validatedData = $request->validate($validationRules);
    
            // Encrypt the password
            $validatedData['password'] = Hash::make($validatedData['password']);
    
            // Create a new UserPifi instance
            $userPifi = new UserPifi();
    
            // Fill the instance with the validated data
            $userPifi->fill($validatedData);
    
            // Generate a unique verification token
            $verificationToken = Str::random(60); 
    
            // Set the verification token in the model
            $userPifi->verification_token = $verificationToken;
    
            // Save the new UserPifi
            $userPifi->save();
    
            // Get the ID of the created user
            $userId = $userPifi->id;
    
            // Create a verification link with the token
            $verificationLink = route('verify.email', ['token' => $verificationToken]);
    
            // Send emails to the provided addresses
            $emailAddresses = [$request->email];
    
            foreach ($emailAddresses as $emailAddress) {
                if ($emailAddress) {
                    $email = new PifiEmail();
                    $email->email_subject = 'Register success';
                    $email->email_content = $verificationLink;
    
                    Mail::to($emailAddress)->send($email);
                }
            }
            
            return response()->json(['message' => 'UserPifi created successfully', 'user_id' => $userId, 'emails_sent' => count($emailAddresses)], Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {        
            return response()->json(['error' => 'Validation failed', 'errors' => $e->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {        
            return response()->json(['error' => 'An unexpected error occurred', 'exception' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    

    
    

    public function update(Request $request, $id)
    {
        // Find the UserPifi instance by ID
        $userPifi = UserPifi::findOrFail($id);

        // Validate the incoming data
        $validatedData = $request->validate([
            // Define validation rules for fields you want to update
        ]);

        // Update the UserPifi instance with the new data
        $userPifi->update($validatedData);

        // Return a JSON response indicating success
        return response()->json(['message' => 'UserPifi updated successfully']);
    }

    public function view($id)
    {
        // Find the UserPifi instance by ID
        $userPifi = UserPifi::findOrFail($id);

        // Return the UserPifi data as JSON
        return response()->json($userPifi);
    }
}
