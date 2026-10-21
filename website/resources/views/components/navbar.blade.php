<header class="kk-header">
    <div class="kk-header-inner">

        <a href="{{ route('home') }}" class="kk-brand">
            <span class="kk-brand-script">Swiss Barber</span>
        </a>

       <nav class="kk-main-nav">
    <a href="{{ route('search') }}">{{ __('messages.search') }}</a>
</nav>

        <div class="kk-header-actions" style="display: flex; align-items: center; gap: 12px;">
            <a href="{{ route('register') }}" class="kk-register">
    {{ __('messages.register_barbershop') }}
</a>

<a href="{{ route('login') }}" class="kk-login">
    {{ __('messages.login') }}
    <span>→</span>
</a>

           
<div class="kk-language-wrapper">
    <button class="kk-language" type="button" id="kkLanguageButton">
        <span class="kk-flag" id="kkCurrentFlag">
            {{ ['en' => '🇬🇧', 'de' => '🇩🇪', 'fr' => '🇫🇷', 'it' => '🇮🇹', 'rm' => '🇨🇭'][session('locale', 'en')] ?? '🇬🇧' }}
        </span>

        <span id="kkCurrentLanguage">
            {{ strtoupper(session('locale', 'en')) }}
        </span>

        <span class="kk-chevron">⌄</span>
    </button>

    <div class="kk-language-dropdown" id="kkLanguageDropdown">
        <form method="POST" action="{{ route('language.switch', 'en') }}">
            @csrf
            <button type="submit">🇬🇧 English</button>
        </form>

        <form method="POST" action="{{ route('language.switch', 'de') }}">
            @csrf
            <button type="submit">🇩🇪 Deutsch</button>
        </form>

        <form method="POST" action="{{ route('language.switch', 'fr') }}">
            @csrf
            <button type="submit">🇫🇷 Français</button>
        </form>

        <form method="POST" action="{{ route('language.switch', 'it') }}">
            @csrf
            <button type="submit">🇮🇹 Italiano</button>
        </form>

        <form method="POST" action="{{ route('language.switch', 'rm') }}">
            @csrf
            <button type="submit">🇨🇭 Rumantsch</button>
        </form>
    </div>
</div>
        </div>

        <button class="kk-menu-button" id="kkMenuButton" type="button">
            <span></span>
            <span></span>
            <span></span>
        </button>

    </div>

    <div class="kk-mobile-nav" id="kkMobileNav">
    <a href="{{ route('search') }}">{{ __('messages.search') }}</a>

    <a href="{{ route('register') }}" class="kk-register">
        {{ __('messages.register_barbershop') }}
    </a>

    <a href="{{ route('login') }}">
        {{ __('messages.login') }} →
    </a>
</div>
</header>

<script>
(function () {
    var header = document.querySelector('.kk-header');
    if (!header) return;
    var update = function () { header.classList.toggle('is-scrolled', window.scrollY > 12); };
    update();
    window.addEventListener('scroll', update, { passive: true });
})();
</script>
