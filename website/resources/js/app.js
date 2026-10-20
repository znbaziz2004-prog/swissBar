import './bootstrap';

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuButton = document.getElementById('kkMenuButton');
    const mobileNav = document.getElementById('kkMobileNav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }


    /* =====================================================
       BARBER REGION SLIDER
       ===================================================== */

    const regionSlider = document.getElementById('kkRegionSlider');
    const regionNext = document.getElementById('kkRegionNext');

    if (regionSlider && regionNext) {
        regionNext.addEventListener('click', () => {
            regionSlider.scrollBy({
                left: 340,
                behavior: 'smooth'
            });
        });
    }


    /* =====================================================
       REVIEWS SLIDER
       ===================================================== */

    const reviewSlider = document.getElementById('kkReviewsTrack');
    const reviewPrev = document.getElementById('kkReviewPrev');
    const reviewNext = document.getElementById('kkReviewNext');

    if (reviewSlider) {

        if (reviewNext) {
            reviewNext.addEventListener('click', () => {
                reviewSlider.scrollBy({
                    left: 420,
                    behavior: 'smooth'
                });
            });
        }

        if (reviewPrev) {
            reviewPrev.addEventListener('click', () => {
                reviewSlider.scrollBy({
                    left: -420,
                    behavior: 'smooth'
                });
            });
        }
    }


    /* =====================================================
       LANGUAGE SELECTOR
       ===================================================== */

    const languageWrapper = document.querySelector('.kk-language-wrapper');
    const languageButton = document.getElementById('kkLanguageButton');
    const languageDropdown = document.getElementById('kkLanguageDropdown');
    const currentFlag = document.getElementById('kkCurrentFlag');
    const currentLanguage = document.getElementById('kkCurrentLanguage');

    if (
        languageWrapper &&
        languageButton &&
        languageDropdown &&
        currentFlag &&
        currentLanguage
    ) {
        const languages = {
            en: { flag: '🇬🇧', code: 'EN' },
            de: { flag: '🇩🇪', code: 'DE' },
            fr: { flag: '🇫🇷', code: 'FR' },
            it: { flag: '🇮🇹', code: 'IT' },
            rm: { flag: '🇨🇭', code: 'RM' }
        };

        const optionButtons = languageDropdown.querySelectorAll('button');

        const closeDropdown = () => {
            languageWrapper.classList.remove('open');
            languageButton.setAttribute('aria-expanded', 'false');
        };

        const applyLanguage = (key) => {
            const language = languages[key];
            if (!language) return;

            currentFlag.textContent = language.flag;
            currentLanguage.textContent = language.code;

            optionButtons.forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.language === key);
            });
        };

        // Open / close dropdown
        languageButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = languageWrapper.classList.toggle('open');
            languageButton.setAttribute('aria-expanded', String(isOpen));
        });

        // Select language
        optionButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const selectedLanguage = button.dataset.language;
                if (!languages[selectedLanguage]) return;

                applyLanguage(selectedLanguage);

                localStorage.setItem('swiss_barber_language', selectedLanguage);

                closeDropdown();
            });
        });

        // Restore saved language
        const savedLanguage = localStorage.getItem('swiss_barber_language');

        if (savedLanguage && languages[savedLanguage]) {
            applyLanguage(savedLanguage);
        }

        // Close when clicking outside
        document.addEventListener('click', (event) => {
            if (!languageWrapper.contains(event.target)) {
                closeDropdown();
            }
        });

        // Close with Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDropdown();
            }
        });
    }

});