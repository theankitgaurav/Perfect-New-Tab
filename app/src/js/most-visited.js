class TopSite {
    constructor(MostVisitedURL) {
        this.title = MostVisitedURL.title;
        this.url = MostVisitedURL.url;
        this.faviconUrl = `chrome://favicon/${MostVisitedURL.url}`;
    }
}

const MostVisitedSitesComponent = new Vue({
    el: '#frequent-sites',
    mixins: [myMixin],
    data: {
        topSitesArray: [],
        hiddenSites: [],
        showAll: false
    },
    computed: {
        topSitesForUser: function () {
            if (!!this.showAll) return this.topSitesArray;
            return this.topSitesArray.filter(el => !this.hiddenSites.includes(el.url));
        }
    },
    created: function() {
        const self = this;
        chrome.topSites.get((topSites) => {
            self.topSitesArray = (topSites || []).map(MostVisitedURL => new TopSite(MostVisitedURL));
        });
        chrome.storage.sync.get('perfect_new_tab_hidden_sites', function(hiddenSites) {
            if (chrome.runtime.lastError) {
                console.error("Error fetching user's hidden top sites", chrome.runtime.lastError);
            } else {
                self.hiddenSites = hiddenSites.perfect_new_tab_hidden_sites || [];   
            }
        });
    },
    methods: {
        deleteItem: function (url) {
            let hiddenSitesSet = new Set(this.hiddenSites);
            if (hiddenSitesSet.has(url)) {
                hiddenSitesSet.delete(url);
                this.hiddenSites = [...hiddenSitesSet];
            } else {
                this.hiddenSites.push(url);
            }
            chrome.storage.sync.set({ 'perfect_new_tab_hidden_sites': this.hiddenSites }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error saving data to chrome storage', chrome.runtime.lastError)
                }
            })
        }
    }
})