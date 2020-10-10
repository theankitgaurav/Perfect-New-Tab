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
    mixins: [myMixin]
})

var customization = new Vue({
    el: '#customize',
    data: {
        showCustomizeText: 'hidden'
    },
    methods: {
        openOptions: function () {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage()
            } else {
                window.open(chrome.runtime.getURL('options.html'))
            }
        },
        showText: function () {
            this.showCustomizeText = 'visible';
        },
        hideText: function () {
            this.showCustomizeText = 'hidden'
        }
    }
})