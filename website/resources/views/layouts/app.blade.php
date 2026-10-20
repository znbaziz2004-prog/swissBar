<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>@yield('title', 'Swiss Barber')</title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="description"
        content="Maak online een afspraak bij je kapper met Swiss Barber. Vind een lokale kapper, kies een tijd en voorkom wachten."
    >

    <meta
        name="theme-color"
        content="#111111"
    >

    <title>
        @yield('title', 'Swiss Barber')
    </title>

    @vite([
        'resources/css/app.css',
        'resources/css/redesign.css',
        'resources/js/app.js'
    ])

    @stack('head')

</head>


<body>

    <div class="kk-page{{ request()->routeIs('home') ? ' kk-home-page' : '' }}">

        @include('components.navbar')

        <main>
            @yield('content')
        </main>

        @include('components.footer')

    </div>


    @stack('scripts')

</body>

</html>
