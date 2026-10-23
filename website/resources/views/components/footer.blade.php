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

<div class="sb-progress" id="sbProgress"></div>
<button class="sb-totop" id="sbTotop" type="button" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6"/></svg>
</button>

<script>
(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* serif italic accent on the last word of headings */
    document.querySelectorAll('.sb-accent').forEach(function (el) {
        var text = el.textContent.trim().replace(/\s+/g, ' ');
        var i = text.lastIndexOf(' ');
        if (i < 0) return;
        var em = document.createElement('em');
        em.className = 'serif';
        em.textContent = text.slice(i + 1);
        el.textContent = text.slice(0, i + 1);
        el.appendChild(em);
    });

    /* scroll progress + back to top */
    var bar = document.getElementById('sbProgress');
    var totop = document.getElementById('sbTotop');
    function onScroll() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
        if (totop) totop.classList.toggle('show', h.scrollTop > 700);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

    /* reveal on scroll */
    var items = document.querySelectorAll('.sb-reveal, .sb-stagger');
    if (!('IntersectionObserver' in window)) { items.forEach(function (n) { n.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (n) { io.observe(n); });
})();
</script>
