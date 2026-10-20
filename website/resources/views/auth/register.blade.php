
@extends('layouts.auth')

@section('title', __('messages.register_title'))

@section('auth_page_class', 'swiss-register-page')

@section('top_action')
    {{ __('messages.register_login_prompt') }}
    <a href="{{ route('login') }}">
        {{ __('messages.register_login_link') }} →
    </a>
@endsection

@section('story')
    <p class="swiss-auth-eyebrow">
        {{ __('messages.register_eyebrow') }}
    </p>

    <h1>{{ __('messages.register_story_heading') }}</h1>

    <p class="swiss-auth-story-copy">
        {{ __('messages.register_story_copy') }}
    </p>

    <ul class="swiss-auth-benefits">
        <li>
            <span class="swiss-auth-benefit-mark">✓</span>
            {{ __('messages.register_benefit_1') }}
        </li>
        <li>
            <span class="swiss-auth-benefit-mark">✓</span>
            {{ __('messages.register_benefit_2') }}
        </li>
        <li>
            <span class="swiss-auth-benefit-mark">✓</span>
            {{ __('messages.register_benefit_3') }}
        </li>
    </ul>
@endsection

@section('form_content')

    <div class="swiss-auth-card-heading">
        <h2>{{ __('messages.register_heading') }}</h2>
        <p>{{ __('messages.register_subtitle') }}</p>
    </div>

    <div class="swiss-auth-price">
        <div>
            <span class="swiss-auth-price-label">
                {{ __('messages.register_plan_label') }}
            </span>

            <span class="swiss-auth-price-value">
                {{ __('messages.register_flexible') }}
            </span>

            <span class="swiss-auth-price-period">
                {{ __('messages.register_pricing') }}
            </span>
        </div>

        <span class="swiss-auth-no-fee">
            {{ __('messages.register_select_package') }}
        </span>
    </div>

    @if ($errors->has('registration'))
        <div class="swiss-auth-alert" role="alert">
            {{ $errors->first('registration') }}
        </div>
    @endif

    <div
        class="swiss-auth-progress"
        aria-label="{{ __('messages.register_progress') }}"
    >
        <div
            class="swiss-auth-progress-step is-active"
            data-register-indicator="1"
        >
            <span class="swiss-auth-progress-step-number">01</span>
            <span>{{ __('messages.register_step_details') }}</span>
        </div>

        <span class="swiss-auth-progress-line" aria-hidden="true"></span>

        <div
            class="swiss-auth-progress-step"
            data-register-indicator="2"
        >
            <span class="swiss-auth-progress-step-number">02</span>
            <span>{{ __('messages.register_step_packages') }}</span>
        </div>
    </div>

    <form
        class="swiss-auth-form"
        action="{{ route('register.submit') }}"
        method="POST"
        id="swissRegisterForm"
    >
        @csrf

        {{-- STEP 1: SHOP AND OWNER DETAILS --}}
        <div class="swiss-auth-step" data-register-step="1">

            <div class="swiss-auth-field-grid">

                <div class="swiss-auth-field swiss-auth-field--full">
                    <label for="shop_name">
                        {{ __('messages.register_shop_name') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="shop_name"
                        name="shop_name"
                        type="text"
                        value="{{ old('shop_name') }}"
                        required
                        maxlength="200"
                        autocomplete="organization"
                        placeholder="{{ __('messages.register_shop_placeholder') }}"
                    >

                    @error('shop_name')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="default_language">
                        {{ __('messages.register_default_language') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <select id="default_language" name="default_language" required>
                        <option value="en" @selected(old('default_language', 'en') === 'en')>
                            English
                        </option>
                        <option value="de" @selected(old('default_language') === 'de')>
                            Deutsch
                        </option>
                        <option value="fr" @selected(old('default_language') === 'fr')>
                            Français
                        </option>
                        <option value="it" @selected(old('default_language') === 'it')>
                            Italiano
                        </option>
                    </select>

                    @error('default_language')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="email">
                        {{ __('messages.register_email') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value="{{ old('email') }}"
                        required
                        maxlength="191"
                        autocomplete="email"
                        placeholder="you@example.com"
                    >

                    @error('email')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="first_name">
                        {{ __('messages.register_first_name') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value="{{ old('first_name') }}"
                        required
                        maxlength="100"
                        autocomplete="given-name"
                        placeholder="{{ __('messages.register_first_name_placeholder') }}"
                    >

                    @error('first_name')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="last_name">
                        {{ __('messages.register_last_name') }}
                    </label>

                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value="{{ old('last_name') }}"
                        maxlength="100"
                        autocomplete="family-name"
                        placeholder="{{ __('messages.register_last_name_placeholder') }}"
                    >

                    @error('last_name')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="coc_number">
                        {{ __('messages.register_coc_number') }}
                    </label>

                    <input
                        id="coc_number"
                        name="coc_number"
                        type="text"
                        value="{{ old('coc_number') }}"
                        maxlength="50"
                        placeholder="{{ __('messages.register_coc_number') }}"
                    >

                    @error('coc_number')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="vat_id">
                        {{ __('messages.register_vat_id') }}
                        <span class="swiss-auth-price-period">
                            ({{ __('messages.register_optional') }})
                        </span>
                    </label>

                    <input
                        id="vat_id"
                        name="vat_id"
                        type="text"
                        value="{{ old('vat_id') }}"
                        maxlength="50"
                        placeholder="{{ __('messages.register_vat_id') }}"
                    >

                    @error('vat_id')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field swiss-auth-field--full">
                    <label for="country">
                        {{ __('messages.register_country') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <select id="country" name="country" required>
                        <option
                            value="Switzerland"
                            @selected(old('country', 'Switzerland') === 'Switzerland')
                        >
                            🇨🇭 {{ __('messages.register_switzerland') }}
                        </option>
                    </select>

                    @error('country')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="street_name">
                        {{ __('messages.register_street_name') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="street_name"
                        name="street_name"
                        type="text"
                        value="{{ old('street_name') }}"
                        required
                        maxlength="150"
                        autocomplete="address-line1"
                        placeholder="{{ __('messages.register_street_name') }}"
                    >

                    @error('street_name')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="building_number">
                        {{ __('messages.register_building_number') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="building_number"
                        name="building_number"
                        type="text"
                        value="{{ old('building_number') }}"
                        required
                        maxlength="30"
                        autocomplete="address-line2"
                        placeholder="{{ __('messages.register_number_placeholder') }}"
                    >

                    @error('building_number')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="postal_code">
                        {{ __('messages.register_postal_code') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="postal_code"
                        name="postal_code"
                        type="text"
                        value="{{ old('postal_code') }}"
                        required
                        maxlength="20"
                        autocomplete="postal-code"
                        placeholder="8001"
                    >

                    @error('postal_code')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="city">
                        {{ __('messages.register_city') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="city"
                        name="city"
                        type="text"
                        value="{{ old('city') }}"
                        required
                        maxlength="100"
                        autocomplete="address-level2"
                        placeholder="Zurich"
                    >

                    @error('city')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field swiss-auth-field--full">
                    <label for="company_phone">
                        {{ __('messages.register_company_phone') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <div class="swiss-auth-phone-control">
                        <span class="swiss-auth-phone-prefix" aria-hidden="true">
                            <span>🇨🇭</span> +41 <span>⌄</span>
                        </span>

                        <input
                            id="company_phone"
                            name="company_phone"
                            type="tel"
                            value="{{ old('company_phone') }}"
                            required
                            maxlength="24"
                            autocomplete="tel-national"
                            placeholder="{{ __('messages.register_phone_placeholder') }}"
                        >
                    </div>

                    @error('company_phone')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field swiss-auth-field--full">
                    <label for="private_phone">
                        {{ __('messages.register_private_phone') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <div class="swiss-auth-phone-control">
                        <span class="swiss-auth-phone-prefix" aria-hidden="true">
                            <span>🇨🇭</span> +41 <span>⌄</span>
                        </span>

                        <input
                            id="private_phone"
                            name="private_phone"
                            type="tel"
                            value="{{ old('private_phone') }}"
                            required
                            maxlength="24"
                            autocomplete="tel"
                            placeholder="{{ __('messages.register_phone_placeholder') }}"
                        >
                    </div>

                    @error('private_phone')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field swiss-auth-field--full">
                    <label for="instagram_username">
                        {{ __('messages.register_instagram') }}
                        <span class="swiss-auth-price-period">
                            ({{ __('messages.register_optional') }})
                        </span>
                    </label>

                    <input
                        id="instagram_username"
                        name="instagram_username"
                        type="text"
                        value="{{ old('instagram_username') }}"
                        maxlength="100"
                        placeholder="{{ __('messages.register_instagram_placeholder') }}"
                    >

                    @error('instagram_username')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field swiss-auth-field--full">
                    <label for="referral_source">
                        {{ __('messages.register_referral_source') }}
                        <span class="swiss-auth-price-period">
                            ({{ __('messages.register_optional') }})
                        </span>
                    </label>

                    <input
                        id="referral_source"
                        name="referral_source"
                        type="text"
                        value="{{ old('referral_source') }}"
                        maxlength="150"
                        placeholder="{{ __('messages.register_referral_placeholder') }}"
                    >

                    @error('referral_source')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="password">
                        {{ __('messages.register_password') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minlength="8"
                        autocomplete="new-password"
                        placeholder="{{ __('messages.register_password_placeholder') }}"
                    >

                    @error('password')
                        <p class="swiss-auth-error">{{ $message }}</p>
                    @enderror
                </div>

                <div class="swiss-auth-field">
                    <label for="password_confirmation">
                        {{ __('messages.register_confirm_password') }}
                        <span class="swiss-auth-required">*</span>
                    </label>

                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        required
                        minlength="8"
                        autocomplete="new-password"
                        placeholder="{{ __('messages.register_confirm_password_placeholder') }}"
                    >
                </div>

            </div>

            <button
                class="swiss-auth-button"
                type="button"
                data-register-next
            >
                {{ __('messages.register_continue') }}
                <span aria-hidden="true">→</span>
            </button>

        </div>

        {{-- STEP 2: PACKAGES --}}
        <div class="swiss-auth-step" data-register-step="2" hidden>

            <div class="swiss-auth-card-heading">
                <h2>{{ __('messages.register_select_package_heading') }}</h2>
                <p>{{ __('messages.register_select_package_description') }}</p>
            </div>

            <div id="swissPackageList">
                <p>{{ __('messages.register_loading_packages') }}</p>
            </div>

            <div class="swiss-auth-step-actions">

                <button
                    class="swiss-auth-button swiss-auth-button--secondary"
                    type="button"
                    data-register-back
                >
                    <span aria-hidden="true">←</span>
                    {{ __('messages.register_back_details') }}
                </button>

                <button class="swiss-auth-button" type="submit">
                    {{ __('messages.register_create_account') }}
                    <span aria-hidden="true">→</span>
                </button>

            </div>

        </div>

    </form>

    <p class="swiss-auth-card-footer">
        {{ __('messages.register_already_registered') }}
        <a class="swiss-auth-inline-link" href="{{ route('login') }}">
            {{ __('messages.register_login_account') }}
        </a>
    </p>

@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('swissRegisterForm');

    if (!form) return;

    const steps = Array.from(
        form.querySelectorAll('[data-register-step]')
    );

    const indicators = Array.from(
        document.querySelectorAll('[data-register-indicator]')
    );

    const packageList = document.getElementById('swissPackageList');

    const messages = {
        loading: @json(__('messages.register_loading_packages')),
        noPackages: @json(__('messages.register_no_packages')),
        loadError: @json(__('messages.register_load_packages_error')),
        passwordMismatch: @json(__('messages.register_password_mismatch')),
        selectPackage: @json(__('messages.register_select_package_alert')),
        creating: @json(__('messages.register_creating_account')),
        createAccount: @json(__('messages.register_create_account')),
        failed: @json(__('messages.register_failed')),
        tokenMissing: @json(__('messages.register_token_missing')),
        paymentError: @json(__('messages.register_payment_error')),

        plans: {
            starter: {
                name: @json(__('messages.plan_starter_name')),
                description: @json(__('messages.plan_starter_description'))
            },
            professional: {
                name: @json(__('messages.plan_professional_name')),
                description: @json(__('messages.plan_professional_description'))
            },
            business: {
                name: @json(__('messages.plan_business_name')),
                description: @json(__('messages.plan_business_description'))
            }
        },

        billingMonth: @json(__('messages.plan_billing_month')),
        billingYear: @json(__('messages.plan_billing_year'))
    };

    const showStep = function (stepNumber) {
        steps.forEach(function (step) {
            step.hidden = Number(step.dataset.registerStep) !== stepNumber;
        });

        indicators.forEach(function (indicator) {
            const number = Number(indicator.dataset.registerIndicator);

            indicator.classList.toggle('is-active', number === stepNumber);
            indicator.classList.toggle('is-complete', number < stepNumber);
        });
    };

    const escapeHtml = function (value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const loadSubscriptionPlans = async function () {
        if (!packageList) return;

        packageList.innerHTML =
            `<p>${escapeHtml(messages.loading)}</p>`;

        try {
            const response = await window.api.get(
                '/subscription-plans/public'
            );

            const plans = response.data?.data?.plans || [];

            if (!plans.length) {
                packageList.innerHTML = `
                    <p class="swiss-auth-error">
                        ${escapeHtml(messages.noPackages)}
                    </p>
                `;
                return;
            }

            packageList.innerHTML = plans.map(function (plan, index) {
                const price = Number(
                    plan.monthly_price ?? plan.price ?? 0
                );

                const currency = plan.currency || 'CHF';

                const billingInterval =
                    plan.billing_interval || plan.billing_cycle || 'monthly';

                // Find translated plan by its name.
                const planKey = String(plan.name || '')
                    .trim()
                    .toLowerCase();

                const translatedPlan = messages.plans[planKey];

                const displayName = translatedPlan
                    ? translatedPlan.name
                    : (plan.name || '');

                const displayDescription = translatedPlan
                    ? translatedPlan.description
                    : (plan.description || '');

                const intervalText =
                    billingInterval === 'yearly'
                        ? messages.billingYear
                        : messages.billingMonth;

                const features = Array.isArray(plan.features)
                    ? plan.features
                    : [];

                return `
                    <label
                        class="swiss-auth-package-card"
                        for="package_${escapeHtml(plan.id)}"
                    >
                        <input
                            id="package_${escapeHtml(plan.id)}"
                            name="plan_id"
                            type="radio"
                            value="${escapeHtml(plan.id)}"
                            ${index === 0 ? 'checked' : ''}
                            required
                        >

                        <span>
                            <span class="swiss-auth-package-name">
                                ${escapeHtml(displayName)}
                            </span>

                            <span class="swiss-auth-package-description">
                                ${escapeHtml(displayDescription)}
                            </span>

                            ${
                                features.length
                                    ? `
                                        <span class="swiss-auth-package-features">
                                            ${features.map(function (feature) {
                                                return `
                                                    <span>
                                                        ✓ ${escapeHtml(feature)}
                                                    </span>
                                                `;
                                            }).join('')}
                                        </span>
                                    `
                                    : ''
                            }
                        </span>

                        <span class="swiss-auth-package-price">
                            ${escapeHtml(currency)} ${price.toFixed(2)}
                            <small>/ ${escapeHtml(intervalText)}</small>
                        </span>
                    </label>
                `;
            }).join('');

        } catch (error) {
            console.error(
                'Failed to load subscription plans:',
                error
            );

            packageList.innerHTML = `
                <p class="swiss-auth-error">
                    ${escapeHtml(messages.loadError)}
                </p>
            `;
        }
    };

    loadSubscriptionPlans();

    const nextButton = form.querySelector('[data-register-next]');
    const backButton = form.querySelector('[data-register-back]');

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            const detailsStep = form.querySelector(
                '[data-register-step="1"]'
            );

            const fields = Array.from(
                detailsStep.querySelectorAll('input, select')
            );

            const firstInvalid = fields.find(function (field) {
                return !field.checkValidity();
            });

            if (firstInvalid) {
                firstInvalid.reportValidity();
                firstInvalid.focus();
                return;
            }

            const password = form.querySelector('#password');
            const confirmation = form.querySelector(
                '#password_confirmation'
            );

            if (password.value !== confirmation.value) {
                confirmation.setCustomValidity(
                    messages.passwordMismatch
                );

                confirmation.reportValidity();
                confirmation.focus();
                return;
            }

            confirmation.setCustomValidity('');
            showStep(2);
        });
    }

    if (backButton) {
        backButton.addEventListener('click', function () {
            showStep(1);
        });
    }

    const confirmationInput = form.querySelector(
        '#password_confirmation'
    );

    if (confirmationInput) {
        confirmationInput.addEventListener('input', function () {
            this.setCustomValidity('');
        });
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = form.querySelector(
            '[data-register-step="2"] button[type="submit"]'
        );

        const selectedPlan = form.querySelector(
            'input[name="plan_id"]:checked'
        );

        if (!selectedPlan) {
            alert(messages.selectPackage);
            return;
        }

        if (!submitButton) return;

        submitButton.disabled = true;
        submitButton.textContent = messages.creating;

        try {
            const firstName = document
                .getElementById('first_name').value.trim();

            const lastName = document
                .getElementById('last_name').value.trim();

            const shopName = document
                .getElementById('shop_name').value.trim();

            const email = document
                .getElementById('email').value.trim();

            const companyPhone = document
                .getElementById('company_phone').value.trim();

            const privatePhone = document
                .getElementById('private_phone').value.trim();

            const streetName = document
                .getElementById('street_name').value.trim();

            const buildingNumber = document
                .getElementById('building_number').value.trim();

            const postalCode = document
                .getElementById('postal_code').value.trim();

            const city = document
                .getElementById('city').value.trim();

            const password = document.getElementById('password').value;

            const instagram = document
                .getElementById('instagram_username').value.trim();

            const payload = {
                name: `${firstName} ${lastName}`.trim(),
                email: email,
                phone: privatePhone,
                password: password,
                shopName: shopName,
                description:
                    'Professional barbershop registered with Swiss Barber.',
                shopPhone: companyPhone,
                shopEmail: email,
                website: '',
                address: `${streetName} ${buildingNumber}`.trim(),
                city: city,
                postalCode: postalCode,
                canton: '',
                planId: Number(selectedPlan.value),
                addOns: {
                    instagram: instagram || null
                }
            };

            const response = await window.api.post(
                '/barber-registration/register',
                payload
            );

            if (response.data && response.data.success) {
                const registrationToken =
                    response.data?.data?.token;

                if (!registrationToken) {
                    throw new Error(messages.tokenMissing);
                }

                const sessionResponse = await fetch(
                    '/registration/complete',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN':
                                document.querySelector(
                                    'meta[name="csrf-token"]'
                                )?.getAttribute('content') || ''
                        },
                        body: JSON.stringify({
                            token: registrationToken
                        })
                    }
                );

                const sessionData = await sessionResponse.json();

                if (!sessionResponse.ok || !sessionData.success) {
                    throw new Error(
                        sessionData.message || messages.paymentError
                    );
                }

                window.location.href = '/subscription/payment';
                return;
            }

            throw new Error(
                response.data?.message || messages.failed
            );

        } catch (error) {
            console.error('Barber registration error:', error);

            let message = messages.failed;

            if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.message) {
                message = error.message;
            }

            alert(message);

            submitButton.disabled = false;
            submitButton.innerHTML =
                `${escapeHtml(messages.createAccount)} <span aria-hidden="true">→</span>`;
        }
    });

    @if ($errors->any())
        showStep(1);
    @endif
});
</script>
@endpush
