// Init Instagram
var feed = new Instafeed({
    get: 'user',
    userId: '7608',
    sortBy: 'most-liked',
    limit: 10,
    clientId: '874257cd75be4d578c56c1ade1330740',
    accessToken: '7608.874257c.e5761d42f4434531ae0057113d6c41fe'
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