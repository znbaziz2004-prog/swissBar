<section class="kk-reviews" id="reviews">
    <div class="kk-reviews-inner">

        @php
            $t = fn ($key, $default) => \Illuminate\Support\Facades\Lang::has('messages.' . $key) ? __('messages.' . $key) : $default;
        @endphp
        <div class="kk-reviews-heading sb-head">
            <div class="sb-eyebrow">{{ $t('testimonials', 'Testimonials') }}</div>
            <h2 class="sb-h2 sb-accent">{{ \Illuminate\Support\Str::ucfirst(mb_strtolower(__('messages.reviews_heading'))) }}</h2>
        </div>

        <div class="kk-reviews-slider">

            <button
                type="button"
                class="kk-reviews-arrow kk-reviews-prev"
                aria-label="{{ __('messages.previous_testimonials') }}"
            >
                ‹
            </button>

            <div class="kk-reviews-viewport">
                <div class="kk-reviews-track">

                    @forelse ($testimonials ?? [] as $testimonial)
                        <article class="kk-review-card">
                            <div class="kk-review-quote">“</div>

                            @php
    $currentLocale = app()->getLocale();

    $reviewTranslations = $testimonial['translations'] ?? [];

    if (is_string($reviewTranslations)) {
        $reviewTranslations = json_decode($reviewTranslations, true) ?? [];
    }

    $displayTestimonial = $reviewTranslations[$currentLocale]
        ?? $testimonial['testimonial']
        ?? '';
@endphp

<p class="kk-review-text">
    {{ $displayTestimonial }}
</p>

                            <div class="kk-review-author">
                                <div class="kk-review-avatar kk-review-initial">
                                    {{ strtoupper(substr($testimonial['shop_name'] ?? 'B', 0, 1)) }}
                                </div>

                                <div>
                                    <strong>
                                        {{ $testimonial['shop_name'] ?? 'Barbershop' }}
                                    </strong>
                                    <span>{{ __('messages.swiss_barber_partner') }}</span>
                                </div>
                            </div>
                        </article>
                    @empty
                        <article class="kk-review-card">
                            <div class="kk-review-quote">“</div>

                            <p class="kk-review-text">
    {{ __("messages.reviews_empty_message") }}
</p>

                            <div class="kk-review-author">
                                <div class="kk-review-avatar kk-review-initial">
                                    S
                                </div>

                                <div>
                                    <strong>{{ __('messages.swiss_barber') }}</strong>
<span>{{ __('messages.our_barbers') }}</span>
                                </div>
                            </div>
                        </article>
                    @endforelse

                </div>
            </div>

            <button
                type="button"
                class="kk-reviews-arrow kk-reviews-next"
                aria-label="{{ __('messages.next_testimonials') }}"
            >
                ›
            </button>

        </div>
    </div>
</section>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.kk-reviews-track');

    if (!track) return;

    const originalCards = Array.from(
        track.querySelectorAll('.kk-review-card')
    );

    // Duplicate cards only when there is more than one.
    if (originalCards.length > 1) {
        originalCards.forEach(function (card) {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }
});
</script>
@endpush