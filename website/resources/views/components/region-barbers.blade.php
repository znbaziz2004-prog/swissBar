@php
    $t = fn ($key, $default) => \Illuminate\Support\Facades\Lang::has('messages.' . $key) ? __('messages.' . $key) : $default;
@endphp

<section class="sb-section sb-region" id="barbers">
    <div class="sb-container">
        <div class="sb-head-row sb-reveal">
            <div class="sb-head">
                <div class="sb-eyebrow">{{ $t('near_you', 'Near you') }}</div>
                <h2 class="sb-h2 sb-accent">{{ \Illuminate\Support\Str::ucfirst(mb_strtolower(__('messages.best_in_region'))) }}</h2>
                <p>{{ $t('region_sub', 'Barbershops loved by the people around you. Swipe or use the arrows.') }}</p>
            </div>
            <div class="sb-arrows">
                <button type="button" class="sb-arrow" id="kkRegionPrev" aria-label="{{ __('messages.previous_testimonials') }}">
                    <svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>
                </button>
                <button type="button" class="sb-arrow" id="kkRegionNext" aria-label="{{ __('messages.next') }}">
                    <svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>
                </button>
            </div>
        </div>

        <div class="sb-rail sb-reveal" id="kkRegionSlider">
            <p id="kkRegionLoading" class="sb-empty">{{ __('messages.loading_barbers') }}</p>
        </div>

        <div class="sb-dots" id="kkRegionDots"></div>

        <div class="sb-center-btn">
            <a href="{{ url('/search') }}" class="sb-btn sb-btn-dark">{{ __('messages.view_all_barbers') }} →</a>
        </div>
    </div>
</section>

<script>
    const regionTranslations = {
        noFeatured: @json(__('messages.no_featured_barbers')),
        couldNotLoad: @json(__('messages.could_not_load_barbers')),
        reviews: @json(__('messages.reviews')),
        new: @json(__('messages.new')),
        view: @json($t('view_shop', 'View shop')),
    };

    document.addEventListener('DOMContentLoaded', async function () {
        const slider = document.getElementById('kkRegionSlider');
        const dotsBox = document.getElementById('kkRegionDots');
        const prev = document.getElementById('kkRegionPrev');
        if (!slider) return;

        /* previous arrow (the "next" arrow is handled in app.js) */
        if (prev) {
            prev.addEventListener('click', function () {
                slider.scrollBy({ left: -340, behavior: 'smooth' });
            });
        }

        function escapeHtml(value) {
            const div = document.createElement('div');
            div.textContent = value ?? '';
            return div.innerHTML;
        }

        function buildDots() {
            if (!dotsBox) return;
            const cards = slider.querySelectorAll('.sb-shop');
            if (cards.length < 2) { dotsBox.innerHTML = ''; return; }
            dotsBox.innerHTML = Array.from(cards).map(function (_, i) {
                return '<button type="button" aria-label="' + (i + 1) + '" data-i="' + i + '"></button>';
            }).join('');
            const update = function () {
                const first = cards[0].offsetWidth + 22;
                const idx = Math.min(cards.length - 1, Math.round(slider.scrollLeft / first));
                dotsBox.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('on', i === idx); });
            };
            slider.addEventListener('scroll', update, { passive: true });
            dotsBox.addEventListener('click', function (e) {
                const b = e.target.closest('button');
                if (!b) return;
                slider.scrollTo({ left: Number(b.dataset.i) * (cards[0].offsetWidth + 22), behavior: 'smooth' });
            });
            update();
        }

        try {
            const response = await window.api.get('/public/shops/featured');
            const shops = Array.isArray(response.data?.data) ? response.data.data : [];

            if (!shops.length) {
                slider.innerHTML = '<p class="sb-empty">' + regionTranslations.noFeatured + '</p>';
                return;
            }

           
slider.innerHTML = shops.map(function (shop) {
    const priority = Number(shop.featured_priority);
    const image = shop.image
        ? shop.image
        : '/images/shop-placeholder.svg';

    const hasRating =
        shop.rating !== null &&
        shop.rating !== undefined &&
        shop.rating !== '';

    return `
        <a href="/shop/${shop.id}" class="sb-shop">
            ${
                Number.isFinite(priority) && priority > 0
                    ? `<span class="sb-region-rank">#${priority}</span>`
                    : ''
            }

            <div class="sb-thumb">
                <img
                    src="${image}"
                    alt="${escapeHtml(shop.name || 'Barbershop')}"
                    loading="lazy"
                    onerror="this.src='/images/shop-placeholder.svg'"
                >
            </div>

            <div class="sb-shop-body">
                <h3>${escapeHtml(shop.name || 'Barbershop')}</h3>

                <div class="sb-rate">
                    <span class="sb-star">★</span>
                    ${
                        hasRating
                            ? `<span>${escapeHtml(String(shop.rating))}</span>`
                            : `<span class="sb-new">${regionTranslations.new}</span>`
                    }
                    <span>${shop.review_count ?? 0} ${regionTranslations.reviews}</span>
                </div>

                <div class="sb-loc">${escapeHtml(shop.city || '')}</div>
                <div class="sb-go-row">${regionTranslations.view} →</div>
            </div>
        </a>
    `;
}).join('');


            buildDots();
        } catch (error) {
            console.error('Featured barbers error:', error);
            slider.innerHTML = '<p class="sb-empty">' + regionTranslations.couldNotLoad + '</p>';
        }
    });
</script>
