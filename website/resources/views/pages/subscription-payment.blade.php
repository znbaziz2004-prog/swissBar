<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><title>{{ __('messages.payment_page_title') }}</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #F6F1E7;
            color: #222;
        }

        .header {
            background: #17251f;
            color: white;
            padding: 22px 7%;
        }

        .header h1 {
            margin: 0;
            font-size: 25px;
        }

        .container {
            max-width: 1100px;
            margin: 45px auto;
            padding: 0 20px;
        }

        .intro {
            text-align: center;
            margin-bottom: 35px;
        }

        .intro h2 {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .intro p {
            color: #666;
        }

        .plans {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 22px;
        }

        .plan {
            background: white;
            padding: 28px;
            border-radius: 12px;
            border: 1px solid #E4DACA;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
        }

        .plan h3 {
            font-size: 23px;
            margin-top: 0;
        }

        .price {
            font-size: 32px;
            font-weight: bold;
            margin: 20px 0 8px;
        }

        .period {
            color: #777;
            font-size: 14px;
        }

        .description {
            color: #666;
            line-height: 1.6;
            min-height: 45px;
        }

        .select-button {
            display: block;
            width: 100%;
            margin-top: 25px;
            padding: 13px;
            background: #111111;
            color: white;
            border: none;
            border-radius: 7px;
            font-size: 15px;
            text-align: center;
            cursor: pointer;
            opacity: 1;
        }

        .select-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }

        .message {
            background: #fff;
            padding: 18px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
        }

        .error {
            color: #b42318;
        }

        @media (max-width: 600px) {
            .intro h2 {
                font-size: 26px;
            }

            .container {
                margin-top: 30px;
            }
        }
            body { font-family: "Plus Jakarta Sans", Arial, sans-serif !important; }
        .header { border-bottom: 6px solid #8e2e3a; }
        .plan { border-radius: 24px !important; border: 1px solid #E4DACA; border-top: 5px solid #8e2e3a; background:#fff; box-shadow: 0 18px 44px rgba(17,17,17,.10); transition: transform .2s; }
        .plan:hover { transform: translateY(-4px); }
        .select-button { border-radius: 999px !important; background:#8e2e3a !important; color:#fff !important; font-weight:700; }
        .select-button:hover:not(:disabled) { background:#17130F !important; color:#fff !important; }
        .select-button:disabled { opacity:.55; }
    </style>
</head>

<body>
    <header class="header">
        <h1>Swiss Barber</h1>
    </header>

    <main class="container">
        <section class="intro">

            @if (session('error'))
                <div class="message error">
                    {{ session('error') }}
                </div>
            @endif

            @if (request()->query('cancelled') === 'true')
                <div class="message error">
                    {{ __('messages.payment_cancelled') }}
                </div>
            @endif

            @if (!empty($paymentMessage))
                <div class="message">
                    {{ $paymentMessage }}
                </div>
            @endif

            @if (!empty($paymentError))
                <div class="message error">
                    {{ $paymentError }}
                </div>
            @endif

            <h2>{{ __('messages.payment_choose_subscription') }}</h2>

            <p>{{ __('messages.payment_choose_description') }}</p>
        </section>

        @if (!empty($subscription))
            <div class="message">
                <h3>{{ __('messages.payment_current_subscription') }}</h3>

                <p>
                    <strong>{{ __('messages.payment_shop') }}:</strong>
                    {{ $subscription['shop_name'] ?? __('messages.payment_your_barbershop') }}
                </p>

                <p>
                    <strong>{{ __('messages.payment_plan') }}:</strong>
                    {{ $subscription['plan_name'] ?? __('messages.payment_not_available') }}
                </p>

                <p>
                    <strong>{{ __('messages.payment_status') }}:</strong>
                    {{ __('messages.payment_status_' . strtolower($subscription['status'] ?? 'unknown')) }}
                </p>

                @if (($subscription['status'] ?? '') === 'active')
                    <p>{{ __('messages.payment_subscription_active_message') }}</p>
                @elseif (($subscription['status'] ?? '') === 'pending')
                    <p>{{ __('messages.payment_subscription_pending_message') }}</p>
                @endif
            </div>
        @elseif (!empty($subscriptionError))
            <div class="message error">
                {{ $subscriptionError }}
            </div>
        @endif

        @if (!empty($error))
            <div class="message error">
                {{ $error }}
            </div>
        @elseif (empty($plans))
            <div class="message">
                {{ __('messages.payment_no_plans') }}
            </div>
        @else
            <div class="plans">
                @foreach ($plans as $plan)
                    <article class="plan">
                        <h3>
                            {{ $plan['name'] ?? $plan['plan_name'] ?? __('messages.payment_subscription_plan') }}
                        </h3>

                        <div class="price">
                            CHF {{ number_format((float) ($plan['price'] ?? 0), 2) }}
                        </div>

                        <div class="period">
                            @php
                                $billingInterval = strtolower($plan['billing_interval'] ?? 'monthly');
                            @endphp

                            @if (in_array($billingInterval, ['monthly', 'month']))
                                {{ __('messages.payment_monthly') }}
                            @elseif (in_array($billingInterval, ['yearly', 'annually', 'year']))
                                {{ __('messages.payment_yearly') }}
                            @else
                                {{ $plan['billing_interval'] ?? __('messages.payment_monthly') }}
                            @endif
                        </div>

                        
@php
    $planName = strtolower(trim(
        $plan['name'] ?? $plan['plan_name'] ?? ''
    ));

    if ($planName === 'starter') {
        $planDescription = __('messages.plan_starter_description');
    } elseif ($planName === 'professional') {
        $planDescription = __('messages.plan_professional_description');
    } elseif ($planName === 'business') {
        $planDescription = __('messages.plan_business_description');
    } else {
        $planDescription = $plan['description']
            ?? __('messages.payment_plan_description');
    }
@endphp

<p class="description">
    {{ $planDescription }}
</p>


                        @if (
                            !empty($subscription) &&
                            ($subscription['status'] ?? '') === 'pending'
                        )
                            <form
                                method="POST"
                                action="{{ route('subscription.checkout') }}"
                            >
                                @csrf

                                <button class="select-button" type="submit">
                                    {{ __('messages.payment_pay') }}
                                    CHF {{ number_format((float) ($subscription['price'] ?? 0), 2) }}
                                </button>
                            </form>

                        @elseif (!empty($subscription) && ($subscription['status'] ?? '') === 'active')
                            <button class="select-button" type="button" disabled>
                                {{ __('messages.payment_subscription_active_button') }}
                            </button>

                        @else
                            <button class="select-button" type="button" disabled>
                                {{ __('messages.payment_complete_registration') }}
                            </button>
                        @endif
                    </article>
                @endforeach
            </div>
        @endif
    </main>
</body>
</html>