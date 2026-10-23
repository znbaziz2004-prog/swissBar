<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function showRegister(): View
    {
        return view('auth.register');
    }

    public function showLogin(): View
    {
        return view('auth.login');
    }

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'shop_name' => ['required', 'string', 'max:200'],
            'default_language' => ['required', 'in:en,de,fr,it'],
            'email' => ['required', 'email', 'max:191'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'coc_number' => ['nullable', 'string', 'max:50'],
            'vat_id' => ['nullable', 'string', 'max:50'],
            'country' => ['required', 'in:Switzerland'],
            'street_name' => ['required', 'string', 'max:150'],
            'building_number' => ['required', 'string', 'max:30'],
            'postal_code' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:100'],
            'company_phone' => [
                'required',
                'regex:/^0?[1-9][0-9\s().-]{6,14}$/',
            ],
            'private_phone' => [
                'required',
                'regex:/^0?[1-9][0-9\s().-]{6,14}$/',
            ],
            'instagram_username' => ['nullable', 'string', 'max:100'],
            'referral_source' => ['nullable', 'string', 'max:150'],
            'package_code' => ['required', 'in:standard'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'email.required' => __('messages.auth_email_required'),
            'email.email' => __('messages.auth_invalid_email'),
            'password.required' => __('messages.auth_password_required'),
            'password.min' => __('messages.auth_password_min'),
            'password.confirmed' => __('messages.auth_password_confirmed'),
            'company_phone.regex' => __('messages.auth_phone_invalid'),
            'private_phone.regex' => __('messages.auth_phone_invalid'),
        ]);
        

        try {
            $response = $this->http()
                ->timeout(15)
                ->post($this->apiUrl('/api/shops/register'), [
                    'shopName' => $data['shop_name'],
                    'defaultLanguage' => $data['default_language'],
                    'firstName' => $data['first_name'],
                    'lastName' => $data['last_name'] ?? '',
                    'email' => $data['email'],
                    'cocNumber' => $data['coc_number'] ?? null,
                    'vatId' => $data['vat_id'] ?? null,
                    'country' => $data['country'],
                    'streetName' => $data['street_name'],
                    'buildingNumber' => $data['building_number'],
                    'postalCode' => $data['postal_code'],
                    'city' => $data['city'],
                    'companyPhone' => $this->formatSwissPhone(
                        $data['company_phone']
                    ),
                    'privatePhone' => $this->formatSwissPhone(
                        $data['private_phone']
                    ),
                    'instagramUsername' => $data['instagram_username'] ?? null,
                    'referralSource' => $data['referral_source'] ?? null,
                    'packageCode' => $data['package_code'],
                    'password' => $data['password'],
                ]);
        } catch (\Throwable $exception) {
            report($exception);

            return back()
                ->withInput($request->except([
                    'password',
                    'password_confirmation',
                ]))
                ->withErrors([
                    'registration' => __('messages.auth_registration_unavailable'),
                ]);
        }

        if (!$response->successful()) {
            $message = $response->json(
                'message',
                __('messages.auth_registration_failed')
            );

            $errorKey = $response->status() === 409
                ? 'email'
                : 'registration';

            return back()
                ->withInput($request->except([
                    'password',
                    'password_confirmation',
                ]))
                ->withErrors([
                    $errorKey => $message,
                ]);
        }

        return redirect()
            ->route('login')
            ->with('status', __('messages.auth_registration_success'));
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email', 'max:191'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => __('messages.auth_email_required'),
            'email.email' => __('messages.auth_invalid_email'),
            'password.required' => __('messages.auth_password_required'),
        ]);

        try {
            $response = $this->http()
                ->timeout(15)
                ->post($this->apiUrl('/api/auth/login'), $credentials);
        } catch (\Throwable $exception) {
            report($exception);

            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'login' => __('messages.auth_login_unavailable'),
                ]);
        }

        if (!$response->successful()) {
            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'login' => __('messages.auth_login_failed'),
                ]);
        }

        $user = $response->json('data.user');
        $token = $response->json('data.token');

        $request->session()->regenerate();

        if (!$token || !is_array($user)) {
            return redirect()->route('login')->withErrors([
                'login' => __('messages.auth_login_failed'),
            ]);
        }

        $request->session()->put('swiss_barber_auth', [
            'token' => $token,
            'user' => $user,
        ]);

        if (($user['role'] ?? null) === 'owner') {
            // Owner returned from Stripe without a session: verify that payment now.
            $pendingSessionId = $request->session()->pull('pending_payment_session_id');

            if (
                is_string($pendingSessionId) &&
                preg_match('/^cs_(test|live)_[A-Za-z0-9_]+$/', $pendingSessionId)
            ) {
                foreach ([
                    '/api/stripe/reconcile-subscription-payment',
                    '/api/stripe/reconcile-registration-payment',
                ] as $endpoint) {
                    try {
                        $verify = $this->http()
                            ->withToken($token)
                            ->timeout(30)
                            ->post($this->apiUrl($endpoint), [
                                'sessionId' => $pendingSessionId,
                            ]);

                        if ($verify->successful() && $verify->json('success')) {
                            $request->session()->put('registration_payment_completed', true);
                            break;
                        }
                    } catch (\Throwable $exception) {
                        report($exception);
                    }
                }
            }

            try {
                $subResponse = $this->http()
                    ->withToken($token)
                    ->timeout(15)
                    ->get($this->apiUrl('/api/subscriptions/my'));
            } catch (\Throwable $exception) {
                report($exception);

                $request->session()->forget('swiss_barber_auth');

                return redirect()->route('login')->with('status',
                    'Unable to verify your account status. Please try again.'
                );
            }

            if (
                !$subResponse->successful()
                || !$subResponse->json('success')
            ) {
                $request->session()->forget('swiss_barber_auth');

                return redirect()->route('login')->with('status',
                    'Unable to verify your account status. Please try again.'
                );
            }

            $subscriptionStatus = strtolower((string) (
                $subResponse->json('data.subscription.status') ?? 'pending'
            ));

            $approvalStatus = strtolower((string) (
                $subResponse->json('data.subscription.shop.approvalStatus')
                ?? $subResponse->json('data.subscription.approvalStatus')
                ?? 'pending'
            ));

            $paymentCompleted = $request->session()->get(
                'registration_payment_completed',
                false
            );

            // Payment complete nahi hui to payment page par bhejein.
            if ($subscriptionStatus === 'pending' && !$paymentCompleted) {
                $request->session()->forget('swiss_barber_auth');

                return redirect()->route('subscription.payment');
            }

            // Super Admin approval ke baghair barber panel access nahi milega.
            if ($approvalStatus !== 'approved') {
                $request->session()->forget('swiss_barber_auth');

                return redirect()->route('login')->with(
                    'status',
                    'Your request is in pending state. You will be able to access the barber panel once the Super Admin approves your account.'
                );
            }

            $request->session()->forget('registration_payment_completed');

           
$handoffResponse = $this->http()
    ->withToken($token)
    ->timeout(15)
    ->post($this->apiUrl('/api/auth/handoff/create'));

if (!$handoffResponse->successful()) {
    \Log::error('Barber login handoff creation failed', [
        'status' => $handoffResponse->status(),
    ]);

    return redirect()->route('login')
        ->withErrors([
            'email' => 'Could not open the barber panel. Please try again.',
        ]);
}

$handoffCode = $handoffResponse->json('data.code');

if (!is_string($handoffCode) || $handoffCode === '') {
    return redirect()->route('login')
        ->withErrors([
            'email' => 'Could not complete barber panel login. Please try again.',
        ]);
}

$panelUrl = rtrim(
    (string) config('services.barber_panel.url'),
    '/'
);

return redirect()->away(
    $panelUrl . '?handoff=' . urlencode($handoffCode)
);

        }

        return redirect()->route('home');
    }

    /**
     * Request to the Express API. SSL verification follows
     * SWISS_BARBER_API_VERIFY_SSL (default: verify).
     */
    private function http(): \Illuminate\Http\Client\PendingRequest
    {
        return Http::acceptJson()->withOptions([
            'verify' => (bool) config('services.swiss_barber_api.verify_ssl', true),
        ]);
    }

    private function apiUrl(string $path): string
    {
        return rtrim(
            (string) config('services.swiss_barber_api.url'),
            '/'
        ) . $path;
    }

    private function formatSwissPhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';
        $digits = ltrim($digits, '0');

        return '+41' . $digits;
    }
}
