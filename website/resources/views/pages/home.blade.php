@extends('layouts.app')

@section('title', 'Swiss Barber - online kapper afspraak maken')

@section('content')

<div class="kk-home-page">

    <section class="kk-hero" id="search">
        <div class="kk-hero-inner">

            <div class="kk-hero-copy">
               <p class="kk-hero-kicker">{{ __('messages.home_welcome') }}</p>

<h1 class="kk-hero-title">SWISS BARBER</h1>

<p class="kk-hero-subtitle">
    {{ __('messages.home_subtitle') }}
</p>

                <form class="kk-search-box" id="barberSearchForm">

                    <label class="kk-search-control">
    <span>{{ __('messages.search') }}</span>
    <input
        type="text"
        name="search"
        class="kk-search-field"
        placeholder="{{ __('messages.search_placeholder') }}"
        aria-label="{{ __('messages.search_barber_aria') }}"
    >
</label>

<label class="kk-search-control">
    <span>{{ __('messages.country') }}</span>
    <select name="country" class="kk-search-select" aria-label="{{ __('messages.country') }}">
        <option value="ch" selected>{{ __('messages.switzerland') }}</option>
    </select>
</label>

<label class="kk-search-control">
    <span>{{ __('messages.city') }}</span>
    <select name="city" class="kk-search-select" aria-label="{{ __('messages.city') }}">
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

<button type="submit" class="kk-search-submit" aria-label="{{ __('messages.search') }}">
    <span class="kk-search-icon"></span>
</button>
                </form>

                <script>
document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('barberSearchForm');

    if (!form) return;

    form.addEventListener('submit', function (event) {

        event.preventDefault();

        const search =
            document.querySelector('.kk-search-field')?.value.trim() || '';

        const country =
            document.querySelector('.kk-search-select[name="country"]')?.value || '';

        const city =
            document.querySelector('.kk-search-select[name="city"]')?.value || '';

        const params = new URLSearchParams();

        if (search) {
            params.append('search', search);
        }

        if (country) {
            params.append('country', country);
        }

        if (city) {
            params.append('city', city);
        }

        window.location.href = `/search?${params.toString()}`;
    });

});
</script>


               <div class="kk-hero-testimonial">
    <p>{{ __('messages.testimonial_text') }}</p>
    <div class="kk-testimonial-author">
        <strong>Mansor</strong>
        <span>Kapsalon Royal</span>
    </div>
</div>

            </div>

            <div class="kk-hero-visual">
                <div class="kk-hero-image-frame">
                    <img
                       src="{{ asset('images/hero-barber.svg') }}"
                        alt="Barber shop with chair, mirror, scissors and comb"
                    >
                </div>
            </div>

        </div>
    </section>

    @include('components.region-barbers')
    @include('components.how-it-works')
    @include('components.reviews')
    
    @include('components.barber-login-bar')

</div>

@endsection
