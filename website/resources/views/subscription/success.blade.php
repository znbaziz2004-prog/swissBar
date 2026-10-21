<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><title>Payment Successful | Swiss Barber</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0; min-height: 100vh; padding: 20px;
            display: flex; align-items: center; justify-content: center;
            font-family: "Plus Jakarta Sans", Arial, sans-serif; background: #f3ebdc; color: #111111;
        }
        .success-card {
            width: 100%; max-width: 560px; padding: 42px 30px;
            background: #fff; border-radius: 18px; text-align: center;
            box-shadow: 0 12px 40px rgba(0,0,0,.08);
        }
        .success-icon {
            width: 72px; height: 72px; margin: 0 auto 20px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%; background: #f3ebdc; color: #c99700;
            font-size: 40px; font-weight: bold;
        }
        h1 { margin: 0 0 10px; font-size: 28px; }
        .description { margin: 0 0 24px; color: #6b6455; line-height: 1.7; }

        .status {
            padding: 16px; margin-bottom: 26px; border-radius: 10px;
            font-size: 14px; line-height: 1.6; text-align: left;
        }
        .status.pending  { background: #fff7df; color: #775b12; }
        .status.approved { background: #f3ebdc; color: #6b4e00; }

        .options { display: flex; flex-direction: column; gap: 14px; text-align: left; }
        .option {
            display: block; padding: 18px 20px; border-radius: 12px;
            text-decoration: none; border: 1px solid #e3d6bc;
            transition: .2s;
        }
        .option strong { display: block; font-size: 16px; margin-bottom: 4px; }
        .option span { font-size: 13px; line-height: 1.5; }

        .option.primary { background: #111111; border-color: #111111; color: #fff; }
        .option.primary span { color: #e3d6bc; }
        .option.primary:hover { background: #2b2822; }

        .option.secondary { background: #fff; color: #111111; }
        .option.secondary span { color: #6b6455; }
        .option.secondary:hover { background: #faf6ee; }

        @media (max-width: 480px) {
            .success-card { padding: 32px 20px; }
            h1 { font-size: 24px; }
        }
            .success-card { border-top: 6px solid #f5b800; box-shadow: 0 24px 60px rgba(17,17,17,.12); border-radius: 28px; }
        .option { border-radius: 16px; }
        .option.primary:hover { background: #f5b800; border-color:#f5b800; color:#111; }
        .option.primary:hover span { color:#2b2822; }
    </style>
</head>
<body>
<main class="success-card">
    <div class="success-icon">&#10003;</div>
    <h1>Payment Successful!</h1>
    <p class="description">Your barbershop registration has been submitted successfully.</p>

    @if ($approvalStatus === 'approved')
        <div class="status approved">
            <strong>✅ Approved</strong><br>
            Your barbershop is approved. You can log in and start using your barber panel.
        </div>
    @else
        <div class="status pending">
            <strong>⏳ Approval Pending</strong><br>
            Your payment is complete, but your barbershop is waiting for Super Admin approval.
            You can still log in, but panel access stays restricted until approval.
        </div>
    @endif

    <div class="options">
        <a href="{{ config('services.barber_panel.url') }}" class="option primary">
            <strong>Option 1: Login as a Barber</strong>
            <span>
                @if ($approvalStatus === 'approved')
                    Go to the login page and open your dashboard.
                @else
                    Go to the login page. Dashboard access remains restricted until approval.
                @endif
            </span>
        </a>

        <a href="{{ route('home') }}" class="option secondary">
            <strong>Option 2: Back to Home Page</strong>
            <span>Return to the customer-facing Swiss Barber website.</span>
        </a>
    </div>
</main>
</body>
</html>