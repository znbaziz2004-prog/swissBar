
@extends('layouts.app')

@section('title', __('messages.contact_title') . ' - Swiss Barber')

@section('content')

<section class="kk-contact-hero">
    <div class="kk-contact-shapes" aria-hidden="true">
        <span class="kk-contact-shape kk-contact-shape-1"></span>
        <span class="kk-contact-shape kk-contact-shape-2"></span>
        <span class="kk-contact-shape kk-contact-shape-3"></span>
        <span class="kk-contact-shape kk-contact-shape-4"></span>
        <span class="kk-contact-shape kk-contact-shape-5"></span>
        <span class="kk-contact-shape kk-contact-shape-6"></span>
        <span class="kk-contact-shape kk-contact-shape-7"></span>
        <span class="kk-contact-shape kk-contact-shape-8"></span>
    </div>

    <h1>{{ __('messages.contact_title') }}</h1>
</section>

<section class="kk-contact-faq">
    <div class="kk-contact-faq-inner">

        @for ($i = 1; $i <= 7; $i++)
            <div class="kk-contact-faq-item">
                <button type="button" class="kk-contact-faq-question">
                    <span>{{ __("messages.contact_faq_q{$i}") }}</span>
                    <span class="kk-contact-faq-arrow">⌄</span>
                </button>

                <div class="kk-contact-faq-answer">
                    <p>{{ __("messages.contact_faq_a{$i}") }}</p>
                </div>
            </div>
        @endfor

    </div>
</section>

<section class="kk-contact-form-section">
    <div class="kk-contact-form-inner">

        <p class="kk-contact-kicker">
            {{ __('messages.contact_not_listed') }}
        </p>

        <h2>{{ __('messages.contact_form_title') }}</h2>

        <div class="kk-contact-note">
            <span class="kk-contact-note-icon">!</span>
            <span>{{ __('messages.contact_note') }}</span>
        </div>

        <div
            id="contact-success"
            style="display:none; margin-bottom:20px; padding:14px 18px; border-radius:10px; background:#e8f7ee; color:#176b3a;"
        ></div>

        <div
            id="contact-error"
            style="display:none; margin-bottom:20px; padding:14px 18px; border-radius:10px; background:#fdecec; color:#a32020;"
        ></div>

        <form id="contact-form" class="kk-contact-form">

            <div class="kk-contact-form-row">
                <div class="kk-contact-field">
                    <label for="contact-name">
                        {{ __('messages.contact_name') }} *
                    </label>

                    <input
                        id="contact-name"
                        type="text"
                        name="name"
                        placeholder="{{ __('messages.contact_name_placeholder') }}"
                        required
                    >
                </div>

                <div class="kk-contact-field">
                    <label for="contact-phone">
                        {{ __('messages.contact_phone') }} *
                    </label>

                    <input
                        id="contact-phone"
                        type="text"
                        name="phone"
                        placeholder="{{ __('messages.contact_phone_placeholder') }}"
                        required
                    >
                </div>
            </div>

            <div class="kk-contact-field">
                <label for="contact-email">
                    {{ __('messages.contact_email') }} *
                </label>

                <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="{{ __('messages.contact_email_placeholder') }}"
                    required
                >
            </div>

            <div class="kk-contact-field">
                <label for="contact-message">
                    {{ __('messages.contact_message') }} *
                </label>

                <textarea
                    id="contact-message"
                    name="message"
                    placeholder="{{ __('messages.contact_message_placeholder') }}"
                    required
                ></textarea>
            </div>

            <button type="submit" class="kk-contact-submit" id="contact-submit">
                {{ __('messages.contact_send') }}
            </button>
        </form>

    </div>
</section>

@include('components.barber-login-bar')

@endsection

@push('scripts')

<script>
document.addEventListener('DOMContentLoaded', function () {

    const questions = document.querySelectorAll('.kk-contact-faq-question');

    questions.forEach(function (button) {
        button.addEventListener('click', function () {

            const item = button.closest('.kk-contact-faq-item');
            const wasActive = item.classList.contains('active');

            document.querySelectorAll('.kk-contact-faq-item').forEach(function (faqItem) {
                faqItem.classList.remove('active');
            });

            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('contact-submit');
    const successBox = document.getElementById('contact-success');
    const errorBox = document.getElementById('contact-error');

    const translations = {
        fillRequired: @json(__('messages.contact_fill_required')),
        success: @json(__('messages.contact_success')),
        error: @json(__('messages.contact_error')),
        sending: @json(__('messages.contact_sending')),
        send: @json(__('messages.contact_send'))
    };

    form.addEventListener('submit', async function (event) {

        event.preventDefault();

        successBox.style.display = 'none';
        errorBox.style.display = 'none';

        const name = document.getElementById('contact-name').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !phone || !email || !message) {
            errorBox.textContent = translations.fillRequired;
            errorBox.style.display = 'block';
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = translations.sending;

        try {

            const response = await window.api.post('/contact', {
                name,
                phone,
                email,
                message
            });

            successBox.textContent =
                response.data?.message || translations.success;

            successBox.style.display = 'block';
            form.reset();

        } catch (error) {

            console.error('Contact form error:', error);

            errorBox.textContent =
                error.response?.data?.message || translations.error;

            errorBox.style.display = 'block';

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = translations.send;
        }
    });

});
</script>

@endpush
