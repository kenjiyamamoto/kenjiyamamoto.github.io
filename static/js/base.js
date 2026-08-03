// Init Instagram
// Credentials must NOT be hardcoded here (this file is public). Provide them at
// runtime, e.g. window.INSTAFEED_CONFIG = { clientId: '...', accessToken: '...' }
// injected from a non-committed source. See README for setup.
var instafeedConfig = window.INSTAFEED_CONFIG || {};
var feed = new Instafeed({
    get: 'user',
    userId: instafeedConfig.userId,
    sortBy: 'most-liked',
    limit: 10,
    clientId: instafeedConfig.clientId,
    accessToken: instafeedConfig.accessToken
});

let instagram = document.getElementById("instagram");
let instagramContent = document.getElementById("instafeed");

instagram.addEventListener("click", startInstagram, false);

function startInstagram(e) {
    if (instagramContent.children.length == 0 ) {
        feed.run();
        instagramContent.className = "animated bounceIn delay-1s show";

        instagramContent.addEventListener("click", function(e){
            if (e.target.id == "instafeed" ) {
                instagramContent.innerHTML = null
                instagramContent.className = "";
            }
        }, false);
    }
    e.preventDefault();
}


window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
    t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));