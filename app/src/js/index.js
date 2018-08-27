var myMixin = {
    methods: {
        openLink: function (url) {
            chrome.tabs.update({ 'url': url, 'selected': true })
        }
    }
}

// Footer logic
var footer = new Vue({
    el: '#footer',
    mixins: [myMixin],
})