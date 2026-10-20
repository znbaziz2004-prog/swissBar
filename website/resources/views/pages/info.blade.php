
@extends('layouts.app')

@section('title', __('messages.info_hero_eyebrow'))

@section('content')

<div class="kk-info-page">

    {{-- HERO --}}
    <section class="kk-info-hero-new">
        <div class="kk-info-hero-decoration kk-info-circle-one"></div>
        <div class="kk-info-hero-decoration kk-info-circle-two"></div>

        <div class="kk-info-hero-content">
            <span class="kk-info-eyebrow">
                {{ __('messages.info_hero_eyebrow') }}
            </span>

            <h1>{!! __('messages.info_hero_title') !!}</h1>

            <p>
                {{ __('messages.info_hero_description') }}
            </p>
        </div>
    </section>

    {{-- GENERAL --}}
    <section class="kk-info-general">
        <div class="kk-info-container">

            <div class="kk-info-general-card">

                <div class="kk-info-general-content">

                    <span class="kk-info-label">
                        {{ __('messages.info_general_label') }}
                    </span>

                    <h2>{!! __('messages.info_general_title') !!}</h2>

                    <p>
                        {{ __('messages.info_general_description') }}
                    </p>

                    <div class="kk-info-general-contact">
                        <strong>
                            {{ __('messages.info_barber_missing') }}
                        </strong>

                        <a href="{{ route('contact') }}">
                            {{ __('messages.info_contact_us') }}
                            <span>→</span>
                        </a>

                        <p>
                            {{ __('messages.info_arrange_it') }}
                        </p>
                    </div>

                </div>

                <div class="kk-info-general-visual">

                    <div class="kk-info-visual-circle">
                        <div class="kk-info-calendar">
                            <span class="kk-calendar-top"></span>
                            <span class="kk-calendar-line"></span>
                            <span class="kk-calendar-line short"></span>

                            <div class="kk-calendar-grid">
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                            </div>

                            <div class="kk-calendar-check">✓</div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </section>

    {{-- QUICK INFORMATION --}}
    <section class="kk-info-options">

        <div class="kk-info-container">

            <div class="kk-info-section-heading">
                <span>{{ __('messages.info_quick_heading') }}</span>
                <h2>{{ __('messages.info_choose_heading') }}</h2>
            </div>

            <div class="kk-info-options-grid">

                {{-- BARBERS --}}
                <article class="kk-info-option-card">

                    <div class="kk-info-option-icon">
                        <span class="kk-info-icon-scissors">✂</span>
                    </div>

                    <span class="kk-info-option-number">01</span>

                    <h3>{{ __('messages.info_barbers_title') }}</h3>

                    <p>
                        {{ __('messages.info_barbers_description') }}
                    </p>

                    <a href="{{ route('register-info') }}">
                        {{ __('messages.info_barbers_link') }}
                        <span>→</span>
                    </a>

                </article>

                {{-- REGISTER --}}
                <article class="kk-info-option-card">

                    <div class="kk-info-option-icon">
                        <span class="kk-info-icon-plus">+</span>
                    </div>

                    <span class="kk-info-option-number">02</span>

                    <h3>{{ __('messages.info_register_title') }}</h3>

                    <p>
                        {{ __('messages.info_register_description') }}
                    </p>

                    <a href="{{ route('register-info') }}">
                        {{ __('messages.info_register_link') }}
                        <span>→</span>
                    </a>

                </article>

                {{-- FAQ --}}
                <article class="kk-info-option-card">

                    <div class="kk-info-option-icon">
                        <span class="kk-info-icon-question">?</span>
                    </div>

                    <span class="kk-info-option-number">03</span>

                    <h3>{{ __('messages.info_faq_title') }}</h3>

                    <p>
                        {{ __('messages.info_faq_description') }}
                    </p>

                    <a href="{{ route('contact') }}#faq">
                        {{ __('messages.info_faq_link') }}
                        <span>→</span>
                    </a>

                </article>

            </div>

        </div>

    </section>

    {{-- CTA --}}
    <section class="kk-info-cta">

        <div class="kk-info-cta-shape kk-info-cta-shape-one"></div>
        <div class="kk-info-cta-shape kk-info-cta-shape-two"></div>

        <div class="kk-info-cta-inner">

            <span class="kk-info-eyebrow">
                {{ __('messages.info_cta_eyebrow') }}
            </span>

            <h2>
                {{ __('messages.info_cta_title') }}
            </h2>

            <p>
                {{ __('messages.info_cta_description') }}
            </p>

            <a href="{{ route('contact') }}" class="kk-info-cta-button">
                {{ __('messages.info_cta_button') }}
                <span>→</span>
            </a>

        </div>

    </section>

</div>

@endsection
