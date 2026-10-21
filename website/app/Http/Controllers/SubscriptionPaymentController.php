<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\View\View;

class SubscriptionPaymentController extends Controller
{
    public function show(Request $request): View|\Illuminate\Http\RedirectResponse
    {
        $plans = [];
        $subscription = null;
        $error = null;
        $subscriptionError = null;
        $paymentMessage = null;
        $paymentError = null;

        try {
            $response = $this->http()
                ->timeout(15)
                ->get($this->apiUrl('/api/subscription-plans/public'));

            if ($response->successful() && $response->json('success')) {
                $plans = $response->json('data.plans', []);
            } else {
                $error = 'Subscription plans could not be loaded.';
            }
        } catch (\Throwable $exception) {
            report($exception);
            $error = 'Unable to connect to the subscription service.';
        }

        $auth = $request->session()->get('swiss_barber_auth', []);
        $token = $auth['token'] ?? null;
        $user = $auth['user'] ?? [];

        if (($user['role'] ?? null) === 'owner' && $token) {
            if ($request->query('success') === 'true') {
                $sessionId = $request->query('session_id');

                if (
                    !is_string($sessionId) ||
                    !preg_match('/^cs_(test|live)_[A-Za-z0-9_]+$/', $sessionId)
                ) {
                    $paymentError = 'Invalid payment session.';
                } else {
                    try {
                        $isRegistrationToken =
                            ($user['purpose'] ?? null) === 'registration_payment';

                        $endpoint = $isRegistrationToken
                            ? '/api/stripe/reconcile-registration-payment'
                            : '/api/stripe/reconcile-subscription-payment';

                        $paymentResponse = $this->http()
                            ->withToken($token)
                            ->timeout(30)
                            ->post($this->apiUrl($endpoint), [
                                'sessionId' => $sessionId,
                            ]);

                        if (
                            $paymentResponse->successful() &&
                            $paymentResponse->json('success')
                        ) {
                            $request->session()->put('subscription_payment_verified', true);

                            return redirect()->route('subscription.success');
                        } else {
                            $paymentError = $paymentResponse->json('message')
                                ?? 'We could not verify your payment.';
                        }
                    } catch (\Throwable $exception) {
                        report($exception);
                        $paymentError =
                            'Unable to verify your payment. Please try again.';
                    }
                }
            }

            try {
                $response = $this->http()
                    ->withToken($token)
                    ->timeout(15)
                    ->get($this->apiUrl('/api/subscriptions/my'));

                if ($response->successful() && $response->json('success')) {
                    $subscription = $response->json('data.subscription');
                } else {
                    $subscriptionError = $response->json('message')
                        ?? 'Unable to load your subscription.';
                }
            } catch (\Throwable $exception) {
                report($exception);
                $subscriptionError =
                    'Unable to connect to your subscription service.';
            }
        } elseif ($request->query('success') === 'true') {
            // Stripe sent the person back but this browser has no login session
            // (for example the checkout was started on another domain).
            $sessionId = $request->query('session_id');

            if (
                !is_string($sessionId) ||
                !preg_match('/^cs_(test|live)_[A-Za-z0-9_]+$/', $sessionId)
            ) {
                $paymentError = 'Invalid payment session.';
            } else {
                // 1) Try to verify without a session (works if the API allows it).
                try {
                    $paymentResponse = $this->http()
                        ->timeout(30)
                        ->post(
                            $this->apiUrl('/api/stripe/reconcile-registration-payment'),
                            ['sessionId' => $sessionId]
                        );

                    if ($paymentResponse->successful() && $paymentResponse->json('success')) {
                        $request->session()->put('subscription_payment_verified', true);

                        return redirect()->route('subscription.success');
                    }
                } catch (\Throwable $exception) {
                    report($exception);
                }

                // 2) Otherwise remember the Stripe session, send the owner to the
                //    login page and verify the payment right after they log in.
                $request->session()->put('pending_payment_session_id', $sessionId);

                return redirect()->route('login')->with(
                    'status',
                    'Payment received. Please log in to confirm your payment and continue.'
                );
            }
        }

        return view('pages.subscription-payment', [
            'plans' => $plans,
            'subscription' => $subscription,
            'error' => $error,
            'subscriptionError' => $subscriptionError,
            'paymentMessage' => $paymentMessage,
            'paymentError' => $paymentError,
        ]);
    }

    public function checkout(Request $request)
    {
        $auth = $request->session()->get('swiss_barber_auth', []);
        $token = $auth['token'] ?? null;
        $user = $auth['user'] ?? [];

        if (!$token || ($user['role'] ?? null) !== 'owner') {
            return redirect()->route('login')
                ->with('error', 'Please log in as a barbershop owner first.');
        }

        try {
            $subscriptionResponse = $this->http()
                ->withToken($token)
                ->timeout(15)
                ->get($this->apiUrl('/api/subscriptions/my'));

            if (
                !$subscriptionResponse->successful() ||
                !$subscriptionResponse->json('success')
            ) {
                return redirect()->route('subscription.payment')
                    ->with('error', 'Unable to verify your subscription. Please try again.');
            }

            $subscription = $subscriptionResponse->json('data.subscription');

            if (!$subscription || empty($subscription['id'])) {
                return redirect()->route('subscription.payment')
                    ->with('error', 'No subscription found for your account. Please complete registration first.');
            }

            if (($subscription['status'] ?? '') !== 'pending') {
                return redirect()->route('subscription.payment')
                    ->with('error', 'Checkout is only available for pending subscriptions.');
            }

            $checkoutResponse = $this->http()
                ->withToken($token)
                ->timeout(30)
                ->post($this->apiUrl('/api/stripe/create-checkout-session'), [
                    'subscriptionId' => $subscription['id'],
                    'locale' => app()->getLocale(),
                    // Where Stripe should send the person back to (this site).
                    'returnUrl' => $request->getSchemeAndHttpHost(),
                ]);

            if (!$checkoutResponse->successful() || !$checkoutResponse->json('success')) {
                return redirect()->route('subscription.payment')
                    ->with('error', $checkoutResponse->json('message')
                        ?? 'Unable to start checkout. Please try again.');
            }

            $checkoutUrl = $checkoutResponse->json('data.url')
                ?? $checkoutResponse->json('data.checkoutUrl');

            if (
                !$checkoutUrl
                || !filter_var($checkoutUrl, FILTER_VALIDATE_URL)
                || parse_url($checkoutUrl, PHP_URL_SCHEME) !== 'https'
                || parse_url($checkoutUrl, PHP_URL_HOST) !== 'checkout.stripe.com'
            ) {
                return redirect()->route('subscription.payment')
                    ->with('error', 'The payment service returned an invalid checkout link.');
            }

            return redirect()->away($checkoutUrl);
        } catch (\Throwable $exception) {
            report($exception);

            return redirect()->route('subscription.payment')
                ->with('error', app()->environment('local')
                    ? 'Checkout error: ' . $exception->getMessage()
                    : 'Unable to start checkout. Please try again.');
        }
    }

    public function success(Request $request)
    {
        if (!$request->session()->get('subscription_payment_verified', false)) {
            return redirect()->route('subscription.payment');
        }

        $auth = $request->session()->get('swiss_barber_auth', []);
        $token = $auth['token'] ?? null;

        $approvalStatus = 'pending';

        if ($token) {
            try {
                $response = $this->http()
                    ->withToken($token)
                    ->timeout(15)
                    ->get($this->apiUrl('/api/subscriptions/my'));

                if ($response->successful() && $response->json('success')) {
                    $status = $response->json(
                        'data.subscription.shop.approvalStatus'
                    ) ?? $response->json(
                        'data.subscription.approvalStatus'
                    ) ?? 'pending';

                    $approvalStatus = strtolower((string) $status) === 'approved'
                        ? 'approved'
                        : 'pending';
                }
            } catch (\Throwable $e) {
                report($e);
            }
        }

        // Payment verified hai; pending account ko payment page par dobara na bhejein.
        $request->session()->put('registration_payment_completed', true);

        // Payment ke baad login page par redirect karein.
        $request->session()->forget([
            'swiss_barber_auth',
            'subscription_payment_verified',
        ]);

        if ($approvalStatus === 'approved') {
            return redirect()->route('login')->with(
                'status',
                'Payment successful. Your account is approved. Please log in.'
            );
        }

        return redirect()->route('login')->with(
            'status',
            'Payment successful. Your request is in pending state. You will be able to access the barber panel once the Super Admin approves your account.'
        );
    }

    /**
     * Pending request to the Express API. SSL verification follows
     * SWISS_BARBER_API_VERIFY_SSL (same behaviour as the /api proxy route).
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
            (string) config('services.swiss_barber_api.url', 'http://127.0.0.1:5000'),
            '/'
        ) . $path;
    }
}