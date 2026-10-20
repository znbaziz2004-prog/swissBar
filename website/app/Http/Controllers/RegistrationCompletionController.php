<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RegistrationCompletionController extends Controller
{
    public function complete(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        try {
            $apiUrl = rtrim(
                config('services.swiss_barber_api.url'),
                '/'
            );

            $response = Http::timeout(10)->post(
                $apiUrl . '/api/barber-registration/validate-payment-token',
                ['token' => $request->token]
            );

            if (!$response->successful() ||
                !$response->json('success')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration token is invalid or expired.',
                ], 401);
            }

            $data = $response->json('data');

            if (($data['user']['role'] ?? null) !== 'owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid account role.',
                ], 403);
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
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to start payment. Please try again.',
            ], 500);
        }
    }
}