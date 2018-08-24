class TopSite {
    constructor(MostVisitedURL) {
        this.title = MostVisitedURL.title;
        this.url = MostVisitedURL.url;
        this.faviconUrl = `chrome://favicon/${MostVisitedURL.url}`;
    }
}

const MostVisitedSitesComponent = new Vue({
    el: '#f_sites',
    mixins: [myMixin],
    data: {
        topSitesArray: []
    },
    created: function() {
        const self = this;
        chrome.topSites.get((topSites) => {
            self.topSitesArray = (topSites || []).map(MostVisitedURL => new TopSite(MostVisitedURL));
        });
    }
})