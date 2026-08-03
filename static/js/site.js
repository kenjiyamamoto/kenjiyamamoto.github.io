/* Shared browser utilities used by the pages of the site. */
window.site = (function () {
    /* Writes the current year into every [data-current-year] element. */
    function renderCurrentYear() {
        const year = String(new Date().getFullYear());
        document.querySelectorAll('[data-current-year]').forEach(function (el) {
            el.textContent = year;
        });
    }

    /*
     * Wires a dark/light theme toggle button. The theme is exposed as the
     * data-theme attribute on <html> ("light", or absent for dark).
     */
    function initThemeToggle(button) {
        if (!button) return;
        const root = document.documentElement;
        let theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

        function apply(t) {
            if (t === 'light') root.setAttribute('data-theme', 'light');
            else root.removeAttribute('data-theme');
            button.textContent = t === 'light' ? '☾' : '☀';
        }

        apply(theme);
        button.addEventListener('click', function () {
            theme = theme === 'dark' ? 'light' : 'dark';
            apply(theme);
        });
    }

    /* Loads a JSONP endpoint and resolves with the payload it calls back with. */
    function jsonp(url, callbackName) {
        return new Promise(function (resolve) {
            const name = callbackName || 'jsonp_callback_' + Math.round(100000 * Math.random());
            const script = document.createElement('script');
            script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + name;

            window[name] = function (data) {
                resolve(data);
                document.body.removeChild(script);
                delete window[name];
            };

            document.body.appendChild(script);
        });
    }

    /*
     * Shared behaviour is opted into through markup: [data-current-year]
     * placeholders and a #themeToggle button.
     */
    document.addEventListener('DOMContentLoaded', function () {
        renderCurrentYear();
        initThemeToggle(document.getElementById('themeToggle'));
    });

    return {
        renderCurrentYear: renderCurrentYear,
        initThemeToggle: initThemeToggle,
        jsonp: jsonp
    };
}());
