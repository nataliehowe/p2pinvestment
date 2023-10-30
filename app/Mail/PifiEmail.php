<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class PifiEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $email_subject;
    public $email_content;
    public $confirmationToken;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Build the message.
     *
     * @return $this
     */
   
    public function build()
    {        
        return $this->view('layouts.mail-pifi')
        ->with([
            'email_subject' => $this->email_subject,
            'email_content' => $this->email_content,
            'confirmationToken' => $this->confirmationToken,
        ]);
}
}



