class TopSite {
    constructor(MostVisitedURL) {
        this.title = MostVisitedURL.title;
        this.url = MostVisitedURL.url;
        this.faviconUrl = `chrome://favicon/${MostVisitedURL.url}`;
        this.hidden = false;
    }
}

const MostVisitedSitesComponent = new Vue({
    el: '#frequent-sites',
    mixins: [myMixin],
    data: {
        topSitesArray: [], // Shape: [Topsite]
        showAll: false
    },
    computed: {
        topSitesForUser: function () {
            return (this.showAll) ? this.topSitesArray : this.topSitesArray.filter(el => !el.hidden);
        }
    },
    watch: {
        topSitesArray: {
            deep: true,
            handler: function(updatedTopSitesArray) {
                const hiddenSites = updatedTopSitesArray.filter(el => el.hidden);
                chrome.storage.sync.set({ 'perfect_new_tab_hidden_sites': hiddenSites }, function() {
                    if (chrome.runtime.lastError) {
                        console.error('Error saving data to chrome storage', chrome.runtime.lastError)
                    }
                });
            }
        }

    },
    created: function() {
        const self = this;
        chrome.topSites.get((topSites) => {

            const topSitesArr = (topSites || []).map(MostVisitedURL => new TopSite(MostVisitedURL));

            chrome.storage.sync.get('perfect_new_tab_hidden_sites', function(result) {
                if (chrome.runtime.lastError) {
                    console.error("Error fetching user's hidden top sites", chrome.runtime.lastError);
                } else {
                    const hiddenSites = result.perfect_new_tab_hidden_sites || [];
                    const hiddenUrlsArr = hiddenSites.map(el => el.url);
                    self.topSitesArray = topSitesArr.map(el => {
                        if (hiddenUrlsArr.includes(el.url)) {
                            el.hidden = true;
                        }
                        return el;
                    });
                }
            });

        });

    }
})