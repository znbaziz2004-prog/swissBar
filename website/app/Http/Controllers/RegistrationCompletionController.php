<?php
namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RegistrationCompletionController extends Controller
{
    public function complete(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $fail = function (string $message, int $status, ?string $debug = null) {
            // The real reason is shown only when APP_DEBUG=true / local env.
            $show = config('app.debug') && $debug;

            return response()->json([
                'success' => false,
                'message' => $show ? "{$message} [{$debug}]" : $message,
            ], $status);
        };

        try {
            $apiUrl = rtrim((string) config('services.swiss_barber_api.url'), '/');

            if ($apiUrl === '') {
                return $fail('Unable to start payment. Please try again.', 500, 'SWISS_BARBER_API_URL is empty in .env');
            }

            $endpoint = $apiUrl . '/api/barber-registration/validate-payment-token';

            $response = Http::acceptJson()
                ->asJson()
                ->withOptions(['verify' => (bool) config('services.swiss_barber_api.verify_ssl', true)])
                ->timeout((int) config('services.swiss_barber_api.timeout', 30))
                ->post($endpoint, ['token' => $request->token]);

            if (!$response->successful() || !$response->json('success')) {
                Log::warning('validate-payment-token failed', [
                    'url' => $endpoint,
                    'status' => $response->status(),
                    'body' => mb_substr($response->body(), 0, 500),
                ]);

                $status = $response->serverError() ? 502 : 401;
                $msg = $response->serverError()
                    ? 'Unable to start payment. Please try again.'
                    : 'Registration token is invalid or expired.';

                return $fail($msg, $status, "API {$response->status()} from {$endpoint}: " . mb_substr($response->body(), 0, 200));
            }

            $data = $response->json('data') ?? [];

            if (($data['user']['role'] ?? null) !== 'owner') {
                return $fail('Invalid account role.', 403, 'role=' . json_encode($data['user']['role'] ?? null));
            }

            $request->session()->put('swiss_barber_auth', [
                'token' => $request->token,
                'user' => $data['user'],
            ]);
            $request->session()->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment session ready.',
            ]);
        } catch (ConnectionException $e) {
            report($e);
            return $fail('Unable to reach the payment service. Please try again.', 503, $e->getMessage());
        } catch (\Throwable $e) {
            report($e);
            return $fail('Unable to start payment. Please try again.', 500, get_class($e) . ': ' . $e->getMessage());
        }
    }
}
