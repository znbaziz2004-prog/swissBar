@extends('layouts.app')

@section('title', 'Shop Details - Swiss Barber')

@section('content')

<section class="sb-shop-page">
    <div id="shopDetails">
        <div class="sb-shop-state"><h2>Loading shop...</h2></div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', async function () {
    const shopId = @json($shopId);
    const container = document.getElementById('shopDetails');
    const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const icons = {
        pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
        phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
        globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
        coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-1.9-.4-2.5-1.2M12 6.5V8M12 16v1.5"/>'
    };

    try {
        const response = await window.api.get(`/public/shops/${shopId}`);
        const shop = response.data?.data;

        if (!shop) {
            container.innerHTML = `<div class="sb-shop-state"><h2>Shop not found</h2><p>This barber shop is not available.</p></div>`;
            return;
        }

        const rows = [
            ['pin', 'Address', `${shop.address || 'Not available'}${shop.city ? ', ' + shop.city : ''}`],
            ['phone', 'Phone', shop.phone || 'Not available'],
            ['mail', 'Email', shop.email || 'Not available'],
            ['globe', 'Country', shop.country || 'Switzerland'],
            ['coin', 'Currency', shop.currency || 'CHF']
        ];

        container.innerHTML = `
            <div class="sb-shop-wrap">
                <div class="sb-shop-media">
                    <img src="${esc(shop.image || '/images/shop-placeholder.svg')}" alt="${esc(shop.name)}" onerror="this.src='/images/shop-placeholder.svg'">
                    <span class="sb-shop-badge">${esc(shop.plan_name || 'Barbershop')}</span>
                </div>
                <div class="sb-shop-info">
                    <h1>${esc(shop.name)}</h1>
                    <p class="sb-shop-desc">${esc(shop.description || 'Professional barber services in Switzerland.')}</p>
                    <dl class="sb-shop-list">
                        ${rows.map(r => `
                            <div class="sb-shop-row">
                                <span class="sb-shop-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[r[0]]}</svg></span>
                                <div><dt>${r[1]}</dt><dd>${esc(r[2])}</dd></div>
                            </div>`).join('')}
                    </dl>
                    <a class="sb-shop-book" href="/shop/${encodeURIComponent(shop.id)}/book">Book appointment</a>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Shop details error:', error);
        container.innerHTML = `<div class="sb-shop-state"><h2>Could not load shop</h2><p>Please try again later.</p></div>`;
    }
});
</script>

@endsection
