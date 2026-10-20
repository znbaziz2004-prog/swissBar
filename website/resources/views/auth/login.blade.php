@extends('layouts.auth')

@section('title', __('messages.login_title'))

@section('top_action')
    {{ __('messages.login_new_here') }}
    <a href="{{ route('register') }}">
        {{ __('messages.login_create_account') }} →
    </a>
@endsection

@section('story')
    <p class="swiss-auth-eyebrow">{{ __('messages.login_eyebrow') }}</p>

    <h1>{{ __('messages.login_story_heading') }}</h1>

    <p class="swiss-auth-story-copy">
        {{ __('messages.login_story_copy') }}
    </p>

    <ul class="swiss-auth-benefits">
        <li><span class="swiss-auth-benefit-mark">✓</span>{{ __('messages.login_benefit_1') }}</li>
        <li><span class="swiss-auth-benefit-mark">✓</span>{{ __('messages.login_benefit_2') }}</li>
        <li><span class="swiss-auth-benefit-mark">✓</span>{{ __('messages.login_benefit_3') }}</li>
    </ul>
@endsection

@section('form_content')
    <div class="swiss-auth-card-heading">
        <h2>{{ __('messages.login_welcome') }}</h2>
        <p>{{ __('messages.login_subtitle') }}</p>
    </div>

    @if (session('status'))
        <div class="swiss-auth-alert swiss-auth-alert--success" role="status">
            {{ session('status') }}
        </div>
    @endif

    @if ($errors->has('login'))
        <div class="swiss-auth-alert" role="alert">
            {{ $errors->first('login') }}
        </div>
    @endif

    <form class="swiss-auth-form" action="{{ route('login.submit') }}" method="POST">
        @csrf

        <div class="swiss-auth-field">
            <label for="email">
                {{ __('messages.login_email') }}
                <span class="swiss-auth-required">*</span>
            </label>

            <input
                id="email"
                name="email"
                type="email"
                value="{{ old('email') }}"
                required
                autocomplete="username"
                autofocus
                placeholder="{{ __('messages.login_email_placeholder') }}"
            >

            @error('email')
                <p class="swiss-auth-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="swiss-auth-field">
            <label for="password">
                {{ __('messages.login_password') }}
                <span class="swiss-auth-required">*</span>
            </label>

            <input
                id="password"
                name="password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="{{ __('messages.login_password_placeholder') }}"
            >

            @error('password')
                <p class="swiss-auth-error">{{ $message }}</p>
            @enderror
        </div>

        @if ($errors->has('email') || $errors->has('password'))
            <div class="swiss-auth-alert" role="alert">
                {{ $errors->first('email') ?: $errors->first('password') }}
            </div>
        @endif

        <button class="swiss-auth-button" type="submit">
            {{ __('messages.login_button') }}
            <span aria-hidden="true">→</span>
        </button>
    </form>

    <p class="swiss-auth-card-footer">
        {{ __('messages.login_need_account') }}
        <a class="swiss-auth-inline-link" href="{{ route('register') }}">
            {{ __('messages.login_register_shop') }}
        </a>
    </p>
@endsection