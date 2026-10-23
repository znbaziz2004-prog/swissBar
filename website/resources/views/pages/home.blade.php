@extends('layouts.app')

@section('title', 'Swiss Barber - online kapper afspraak maken')

@section('content')
@php
    $t = fn ($key, $default) => \Illuminate\Support\Facades\Lang::has('messages.' . $key) ? __('messages.' . $key) : $default;
    $words = array_map('trim', explode(',', $t('hero_words', 'cut,trim,fade,shave')));
    $icons = [
        'pin' => '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
        'clock' => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        'bell' => '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 20a2 2 0 0 0 3.4 0"/>',
        'cal' => '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4"/>',
        'star' => '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
        'phone' => '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    ];
    $features = [
        ['pin', $t('feat_1_title', 'Barbers near you'), $t('feat_1_text', 'See barbershops based on your location, or search any city manually.')],
        ['clock', $t('feat_2_title', 'Live availability'), $t('feat_2_text', 'Free time slots are shown instantly, so you pick what fits your day.')],
        ['bell', $t('feat_3_title', 'Booking reminders'), $t('feat_3_text', 'Arrive on time thanks to a reminder before your appointment.')],
        ['cal', $t('feat_4_title', 'No waiting line'), $t('feat_4_text', 'Book ahead, walk in at your time and skip the queue completely.')],
        ['star', $t('feat_5_title', 'Real reviews'), $t('feat_5_text', 'Read honest feedback from other customers before you choose.')],
        ['phone', $t('feat_6_title', 'Works on any device'), $t('feat_6_text', 'Book from your phone, tablet or computer, wherever you are.')],
    ];
    $cities = [['zurich', 'Zurich'], ['geneva', 'Geneva'], ['basel', 'Basel'], ['bern', 'Bern'], ['lausanne', 'Lausanne']];
    $faqs = [
        [$t('faq_1_q', 'How do I book an appointment?'), $t('faq_1_a', 'Search for a barber by name or city, pick a service and a free time slot, then confirm. No phone call needed.')],
        [$t('faq_2_q', 'Can I cancel or reschedule?'), $t('faq_2_a', "Yes. Open your booking and choose a new time, or cancel it, as long as the barbershop's cancellation window allows it.")],
        [$t('faq_3_q', 'How do I register my barbershop?'), $t('faq_3_a', 'Choose "Register Barbershop" in the top menu, fill in your shop details and services, and you can start receiving bookings.')],
        [$t('faq_4_q', 'Which cities can I find barbers in?'), $t('faq_4_a', "Pick your country and city in the search bar. We're growing across Switzerland and new barbershops join all the time.")],
    ];
    $ticker = array_map('trim', explode(',', $t('ticker', 'Haircut,Beard trim,Hot towel shave,Skin fade,Kids cut,Styling')));
@endphp

{{-- ================= HERO ================= --}}
<section class="sb-hero" id="search">
    <div class="sb-container sb-hero-grid">
        <div>
            <div class="sb-tag"><span class="sb-dot"></span>{{ $t('hero_tag', 'Barbershops across Switzerland') }}</div>

            <h1 class="sb-title">
                {{ $t('hero_title_a', 'Book your next') }}
                <em class="serif sb-mark"><span class="sb-rot" id="sbRot" data-words='@json($words)'>{{ $words[0] ?? 'cut' }}</span><svg viewBox="0 0 200 14" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M3 9c30-8 60-8 95-3s62 5 98-2" stroke="#17130F" stroke-width="5" stroke-linecap="round"/></svg></em>{{ $t('hero_title_b', ', in seconds.') }}
            </h1>

            <p class="sb-lead">{{ __('messages.home_subtitle') }}</p>

            <form class="sb-search" id="barberSearchForm">
                <label class="sb-field">
                    <span>{{ __('messages.search') }}</span>
                    <input type="text" name="search" id="sbSearchInput" placeholder="{{ __('messages.search_placeholder') }}" aria-label="{{ __('messages.search_barber_aria') }}">
                </label>
                <label class="sb-field">
                    <span>{{ __('messages.country') }}</span>
                    <select name="country" id="sbCountry" aria-label="{{ __('messages.country') }}">
                        <option value="ch" selected>{{ __('messages.switzerland') }}</option>
                    </select>
                </label>
                <label class="sb-field">
                    <span>{{ __('messages.city') }}</span>
                    <select name="city" id="sbCity" aria-label="{{ __('messages.city') }}">
                        <option value="">{{ __('messages.all_cities') }}</option>
                        <option value="zurich">Zurich</option>
                        <option value="geneva">Geneva</option>
                        <option value="basel">Basel</option>
                        <option value="lausanne">Lausanne</option>
                        <option value="bern">Bern</option>
                        <option value="winterthur">Winterthur</option>
                        <option value="lucerne">Lucerne</option>
                        <option value="st-gallen">St. Gallen</option>
                        <option value="lugano">Lugano</option>
                        <option value="biel">Biel/Bienne</option>
                        <option value="thun">Thun</option>
                        <option value="zug">Zug</option>
                        <option value="fribourg">Fribourg</option>
                        <option value="chur">Chur</option>
                        <option value="neuchatel">Neuchâtel</option>
                        <option value="schaffhausen">Schaffhausen</option>
                    </select>
                </label>
                <button type="submit" class="sb-go" aria-label="{{ __('messages.search') }}">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                </button>
            </form>

            <div class="sb-cities">
                <span>{{ $t('popular', 'Popular:') }}</span>
                @foreach (array_slice($cities, 0, 4) as $c)
                    <a href="{{ url('/search') }}?country=ch&city={{ $c[0] }}">{{ $c[1] }}</a>
                @endforeach
            </div>

            <div class="sb-quote">
                <p>{{ __('messages.testimonial_text') }}</p>
                <small><b>Mansor</b> · Kapsalon Royal</small>
            </div>
        </div>

        <div class="sb-stage" id="sbStage">
            <div class="sb-wine">
                <div class="sb-booking" id="sbBooking" aria-label="Booking preview">
                    <div class="sb-b-inner">
                        <div class="sb-b-head">
                            <div class="sb-avatar" id="sbAvatar">MB</div>
                            <div><h3 id="sbName">Musa Barber Studio</h3><small><span id="sbCityName">Zurich</span> · <span class="sb-star">★</span> {{ __('messages.new') }}</small></div>
                        </div>
                        <div class="sb-b-label">{{ $t('demo_service', 'Service') }}</div>
                        <div id="sbServices"></div>
                        <div class="sb-b-label">{{ $t('demo_tomorrow', 'Tomorrow') }}</div>
                        <div class="sb-slots" id="sbSlots"></div>
                        <button class="sb-b-btn" id="sbBtn" type="button"><span id="sbLabel">{{ $t('demo_book', 'Book appointment') }}</span><span id="sbPrice">CHF 35</span></button>
                    </div>
                </div>
                <div class="sb-hdots" id="sbHdots"></div>
            </div>
            <div class="sb-sticker">24/7<small>{{ $t('demo_online', 'Online booking') }}</small></div>
            <div class="sb-float" id="sbFloat">
                <i><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg></i>
                <div><b>{{ $t('demo_confirmed', 'Booking confirmed') }}</b><small id="sbFloatTime">{{ $t('demo_tomorrow', 'Tomorrow') }} · 10:00</small></div>
            </div>
        </div>
    </div>
</section>

{{-- ================= TICKER ================= --}}
<div class="sb-strip" aria-hidden="true">
    <div class="sb-track">
        @for ($i = 0; $i < 2; $i++)
            <div class="sb-group">@foreach ($ticker as $item)<span>{{ $item }}</span>@endforeach</div>
        @endfor
    </div>
</div>

@include('components.region-barbers')

{{-- ================= WHY ================= --}}
<section class="sb-section sb-why">
    <div class="sb-container">
        <div class="sb-head center sb-reveal">
            <div class="sb-eyebrow">{{ $t('why_eyebrow', 'Why Swiss Barber') }}</div>
            <h2 class="sb-h2">{{ $t('why_title_a', 'Everything for a') }} <em class="serif">{{ $t('why_title_b', 'perfect') }}</em> {{ $t('why_title_c', 'visit') }}</h2>
            <p>{{ $t('why_sub', 'One place to find, compare and book your barber, without the back and forth.') }}</p>
        </div>
        <div class="sb-feat-grid sb-stagger">
            @foreach ($features as $i => $f)
                <div class="sb-feat" style="--i: {{ $i }}">
                    <div class="sb-fi"><svg viewBox="0 0 24 24">{!! $icons[$f[0]] !!}</svg></div>
                    <h3>{{ $f[1] }}</h3>
                    <p>{{ $f[2] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>

@include('components.how-it-works')

{{-- ================= BROWSE BY CITY ================= --}}
<section class="sb-section">
    <div class="sb-container">
        <div class="sb-head center sb-reveal">
            <div class="sb-eyebrow">{{ $t('explore', 'Explore') }}</div>
            <h2 class="sb-h2">{{ $t('cities_title_a', 'Browse by') }} <em class="serif">{{ $t('cities_title_b', 'city') }}</em></h2>
            <p>{{ $t('cities_sub', 'Pick your city and jump straight to the barbers around you.') }}</p>
        </div>
        <div class="sb-city-grid sb-stagger">
            @foreach ($cities as $i => $c)
                <a href="{{ url('/search') }}?country=ch&city={{ $c[0] }}" class="sb-city ct{{ $i + 1 }}" style="--i: {{ $i }}">
                    <i>→</i><b>{{ $c[1] }}</b><small>{{ $t('explore_barbers', 'Explore barbers') }}</small>
                </a>
            @endforeach
        </div>
    </div>
</section>

@include('components.reviews')

{{-- ================= FAQ ================= --}}
<section class="sb-section sb-faq" id="faq">
    <div class="sb-container sb-faq-grid">
        <div class="sb-faq-side sb-reveal">
            <div class="sb-eyebrow">{{ $t('faq', 'FAQ') }}</div>
            <h2 class="sb-h2">{{ $t('faq_title_a', 'Good to') }} <em class="serif">{{ $t('faq_title_b', 'know') }}</em></h2>
            <p>{{ $t('faq_sub', "Quick answers to the questions we hear most. Still stuck? Get in touch and we'll help.") }}</p>
            <a href="{{ route('contact') }}" class="sb-btn sb-btn-dark">{{ $t('contact_us', 'Contact us') }} →</a>
        </div>
        <div class="sb-reveal">
            @foreach ($faqs as $i => $f)
                <details class="sb-q" @if ($i === 0) open @endif>
                    <summary>{{ $f[0] }}</summary>
                    <div class="sb-ans">{{ $f[1] }}</div>
                </details>
            @endforeach
        </div>
    </div>
</section>

{{-- ================= CTA ================= --}}
<section class="sb-section">
    <div class="sb-container">
        <div class="sb-cta sb-reveal">
            <div>
                <h2>{{ $t('cta_title', 'Own a barbershop?') }}</h2>
                <p>{{ $t('cta_text', 'Join Swiss Barber, fill your calendar and let customers book you 24/7.') }}</p>
            </div>
            <a href="{{ route('register') }}" class="sb-btn sb-btn-cream">{{ __('messages.register_barbershop') }} →</a>
        </div>
    </div>
</section>

@include('components.barber-login-bar')
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    /* ---- search form (same behaviour as before) ---- */
    var form = document.getElementById('barberSearchForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var params = new URLSearchParams();
            var search = (document.getElementById('sbSearchInput').value || '').trim();
            var country = document.getElementById('sbCountry').value || '';
            var city = document.getElementById('sbCity').value || '';
            if (search) params.append('search', search);
            if (country) params.append('country', country);
            if (city) params.append('city', city);
            window.location.href = '/search?' + params.toString();
        });
    }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- rotating word in the headline ---- */
    var rot = document.getElementById('sbRot');
    if (rot && !reduce) {
        var words = [];
        try { words = JSON.parse(rot.getAttribute('data-words')); } catch (e) {}
        if (words.length > 1) {
            var wi = 0;
            setInterval(function () {
                rot.classList.add('out');
                setTimeout(function () { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.classList.remove('out'); }, 350);
            }, 2600);
        }
    }

    /* ---- demo booking card (illustration only) ---- */
    var shops = [
        { n: 'Musa Barber Studio', i: 'MB', c: 'Zurich', s: [['Haircut', 'CHF 35 · 30 min', 35], ['Cut + beard', 'CHF 48 · 45 min', 48]] },
        { n: 'Kapsalon Royal', i: 'KR', c: 'Geneva', s: [['Skin fade', 'CHF 40 · 40 min', 40], ['Hot towel shave', 'CHF 32 · 30 min', 32]] },
        { n: "The Gentlemen's Cut", i: 'GC', c: 'Basel', s: [['Classic cut', 'CHF 38 · 30 min', 38], ['Kids cut', 'CHF 25 · 20 min', 25]] }
    ];
    var times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
    var off = { 0: 1, 5: 1 };
    var booking = document.getElementById('sbBooking');
    if (!booking) return;
    var el = function (id) { return document.getElementById(id); };
    var cur = 0, svc = 0, slot = 2, timer = null;

    function renderServices() {
        el('sbServices').innerHTML = shops[cur].s.map(function (s, k) {
            return '<div class="sb-service' + (k === svc ? ' on' : '') + '" data-k="' + k + '">' + s[0] + ' <em>' + s[1] + '</em></div>';
        }).join('');
        el('sbPrice').textContent = 'CHF ' + shops[cur].s[svc][2];
    }
    function renderSlots() {
        el('sbSlots').innerHTML = times.map(function (t, k) {
            return '<div class="sb-slot' + (off[k] ? ' off' : '') + (k === slot ? ' on' : '') + '" data-k="' + k + '">' + t + '</div>';
        }).join('');
        el('sbFloatTime').textContent = el('sbFloatTime').textContent.split(' · ')[0] + ' · ' + times[slot];
    }
    function show(n) {
        cur = n; svc = 0; slot = 2;
        booking.classList.add('swap');
        setTimeout(function () {
            el('sbAvatar').textContent = shops[n].i;
            el('sbName').textContent = shops[n].n;
            el('sbCityName').textContent = shops[n].c;
            var b = el('sbBtn'); b.classList.remove('done');
            el('sbLabel').textContent = b.getAttribute('data-label');
            renderServices(); renderSlots();
            booking.classList.remove('swap');
            dots();
        }, 260);
    }
    function dots() {
        el('sbHdots').innerHTML = shops.map(function (s, k) { return '<button type="button" aria-label="Demo ' + (k + 1) + '" class="' + (k === cur ? 'on' : '') + '" data-k="' + k + '"></button>'; }).join('');
    }
    function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show((cur + 1) % shops.length); }, 6500); }

    el('sbBtn').setAttribute('data-label', el('sbLabel').textContent);
    el('sbServices').addEventListener('click', function (e) { var t = e.target.closest('.sb-service'); if (!t) return; svc = +t.dataset.k; renderServices(); auto(); });
    el('sbSlots').addEventListener('click', function (e) { var t = e.target.closest('.sb-slot'); if (!t || t.classList.contains('off')) return; slot = +t.dataset.k; renderSlots(); auto(); });
    el('sbHdots').addEventListener('click', function (e) { var t = e.target.closest('button'); if (!t) return; show(+t.dataset.k); auto(); });
    el('sbBtn').addEventListener('click', function () {
        var b = this; b.classList.add('done'); el('sbLabel').textContent = '✓ ' + document.querySelector('.sb-float b').textContent;
        var f = el('sbFloat'); f.classList.remove('pulse'); void f.offsetWidth; f.classList.add('pulse'); auto();
    });
    /* gentle tilt */
    var stage = el('sbStage');
    if (stage && !reduce && window.matchMedia('(hover: hover)').matches) {
        stage.addEventListener('mousemove', function (e) {
            var r = stage.getBoundingClientRect();
            booking.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 8).toFixed(2) + 'deg');
            booking.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2) + 'deg');
        });
        stage.addEventListener('mouseleave', function () { booking.style.setProperty('--rx', '0deg'); booking.style.setProperty('--ry', '0deg'); });
    }
    renderServices(); renderSlots(); dots(); auto();
});
</script>
@endpush
