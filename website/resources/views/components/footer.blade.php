<footer class="swiss-footer">
    <div class="swiss-footer-inner">

        {{-- Brand --}}
        <div class="swiss-footer-brand">
            <a href="{{ route('home') }}" class="swiss-footer-logo">
                Swiss Barber
            </a>

            <p>{{ __('messages.footer_tagline') }}</p>

            <a href="{{ route('contact') }}" class="swiss-footer-contact-link">
                {{ __('messages.get_in_touch') }} →
            </a>
        </div>

        {{-- Navigation --}}
        <div class="swiss-footer-column">
            <h3>{{ __('messages.explore') }}</h3>

            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <a href="{{ route('search') }}">{{ __('messages.search') }}</a>
            <a href="{{ route('info') }}">{{ __('messages.info') }}</a>
            <a href="{{ route('contact') }}">{{ __('messages.contact') }}</a>
        </div>

        {{-- Barbers & Portals --}}
        <div class="swiss-footer-column">
            <h3>{{ __('messages.portals') }}</h3>

            <a href="{{ route('register-info') }}">
                {{ __('messages.register_barbershop') }}
            </a>

            <a href="{{ route('login') }}">
                {{ __('messages.login') }}
            </a>
        </div>

        {{-- Legal --}}
        <div class="swiss-footer-column">
            <h3>{{ __('messages.legal') }}</h3>

            <a href="{{ route('terms-of-use') }}">
                {{ __('messages.terms_of_use') }}
            </a>

            <a href="{{ route('privacy-policy') }}">
                {{ __('messages.privacy_policy') }}
            </a>
        </div>
    </div>

    {{-- Footer Bottom --}}
    <div class="swiss-footer-bottom">
        <p>
            © {{ date('Y') }} Swiss Barber.
            {{ __('messages.footer_rights') }}
        </p>

        <div class="swiss-footer-bottom-links">
            <a href="{{ route('terms-of-use') }}">
                {{ __('messages.terms_of_use') }}
            </a>

            <span></span>

            <a href="{{ route('privacy-policy') }}">
                {{ __('messages.privacy_policy') }}
            </a>
        </div>
    </div>
</footer>