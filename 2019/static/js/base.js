// Init Instagram
var feed = new Instafeed({
    get: 'tagged',
    tagName: 'awesome',
    clientId: '874257cd75be4d578c56c1ade1330740'
});
feed.run();