<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubscriptionPaymentController;
use App\Http\Controllers\RegistrationCompletionController;


Route::middleware('web')->group(function () {
    Route::get(
        '/subscription/payment',
        [SubscriptionPaymentController::class, 'show']
    )->name('subscription.payment');
    
Route::get('/subscription/success', [SubscriptionPaymentController::class, 'success'])
    ->name('subscription.success');
   


});


Route::post('/registration/complete', [
    RegistrationCompletionController::class,
    'complete'
])->name('registration.complete');

Route::post(
    '/subscription/checkout',
    [SubscriptionPaymentController::class, 'checkout']
)->name('subscription.checkout');

Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');




Route::post('/language/{locale}', function (
    \Illuminate\Http\Request $request,
    string $locale
) {
    $supportedLanguages = ['en', 'de', 'fr', 'it', 'rm'];

    abort_unless(
        in_array($locale, $supportedLanguages, true),
        404
    );

    $request->session()->put('locale', $locale);

    return redirect('/');
})->name('language.switch');

Route::get('/', function () {
    $testimonials = [];

    try {
        $backendBase = rtrim((string) config('services.swiss_barber_api.url', 'http://127.0.0.1:5000'), '/');
        $response = \Illuminate\Support\Facades\Http::timeout(10)
            ->get($backendBase . '/api/barber-testimonials/public');

        if ($response->successful()) {
            $testimonials = $response->json('data.testimonials', []);
        }
    } catch (\Throwable $e) {
        \Illuminate\Support\Facades\Log::error(
            'Failed to fetch approved barber testimonials: ' . $e->getMessage()
        );
    }

    return view('pages.home', [
        'testimonials' => $testimonials,
    ]);
})->name('home');


Route::get('/search', function () {
    return view('pages.search');
})->name('search');


Route::get('/shop/{id}', function ($id) {
    return view('pages.shop-details', [
        'shopId' => $id
    ]);
})->name('shop.details');


Route::get('/shop/{id}/book', function ($id) {
    return view('pages.booking', [
        'shopId' => $id
    ]);
})->name('shop.book');


Route::get('/info', function () {
    return view('pages.info');
})->name('info');


Route::get('/contact', function () {
    return view('pages.contact');
})->name('contact');


Route::get('/register-info', function () {
    return view('pages.register-info');
})->name('register-info');


Route::get('/terms-of-use', function () {
    return view('pages.terms-of-use');
})->name('terms-of-use');


Route::get('/privacy-policy', function () {
    return view('pages.privacy-policy');
})->name('privacy-policy');


/*
|--------------------------------------------------------------------------
| Universal API Proxy Fallback (for cPanel environments)
|--------------------------------------------------------------------------
| Forwards /api/* requests to the Express backend if mod_proxy is disabled.
*/
Route::any('/api/{path}', function (\Illuminate\Http\Request $request, string $path) {
    $backendBase = rtrim(config('services.swiss_barber_api.url', 'http://127.0.0.1:5000'), '/');
    $url = $backendBase . '/api/' . $path;

    if ($query = $request->getQueryString()) {
        $url .= '?' . $query;
    }

    $headers = collect($request->headers->all())
        ->map(fn($v) => is_array($v) ? implode(', ', $v) : $v)
        ->except(['host', 'content-length'])
        ->toArray();

    try {
        $method = strtolower($request->method());
        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)
            ->withoutVerifying()
            ->timeout(60)
            ->send($method, $url, [
                'body' => $request->getContent(),
            ]);

        return response($response->body(), $response->status(), [
            'Content-Type' => $response->header('Content-Type') ?: 'application/json',
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Backend API service unavailable: ' . $e->getMessage(),
        ], 502);
    }
})->where('path', '.*');