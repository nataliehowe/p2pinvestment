{!! $email_subject !!}
{!! $email_content !!}
<p>Click the following link to confirm your email:</p>
<a href="{{ route('pifi-confirmation', ['token' => $confirmationToken]) }}">Confirm Email</a>
