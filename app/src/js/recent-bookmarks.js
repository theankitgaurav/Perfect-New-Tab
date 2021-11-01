const RecentBookmarksComponent = new Vue({
    el: '#recent-bookmarks',
    mixins: [mixins],
    data: {
        recentBookmarksArray: [],
        bookmarksPrefs: defaultPreferences.bookmarks,
        itemsToDisplay: defaultPreferences.bookmarks.minItems,
        showAll: false
    },
    watch: {
        showAll: function(showAll) {
            this.itemsToDisplay = (!!showAll) ? this.bookmarksPrefs.maxItems : this.bookmarksPrefs.minItems;
            this.getRecentBookmarks();
        }
    },
    created: async function() {
        let storedPrefs = await getStorageData('perfect_new_tab_prefs')
        const self = this;
        self.addListener();
        self.bookmarksPrefs = storedPrefs && storedPrefs.perfect_new_tab_prefs && storedPrefs.perfect_new_tab_prefs.bookmarks
            ? storedPrefs.perfect_new_tab_prefs.bookmarks : defaultPreferences.bookmarks;
        self.itemsToDisplay = self.bookmarksPrefs.minItems;
        self.getRecentBookmarks();
    },
    methods: {
        deleteItem: function(bookmarkId) {
            chrome.bookmarks.remove(bookmarkId);
            this.getRecentBookmarks();
        },
        addListener: function () {
            const self = this
            chrome.storage.onChanged.addListener((changes, area) => {
                const changedPrefs = changes.perfect_new_tab_prefs;
                if (changedPrefs && changedPrefs.newValue) {
                    self.bookmarksPrefs = changedPrefs.newValue.bookmarks;
                    self.itemsToDisplay = (!!self.showAll) ? self.bookmarksPrefs.maxItems : self.bookmarksPrefs.minItems;
                    self.getRecentBookmarks();
                }
            });
        },
        getRecentBookmarks: function() {
            const self = this
            chrome.bookmarks.getRecent(self.itemsToDisplay, results => {
                self.recentBookmarksArray = results.map(el=> new BookmarkItem(el));
            })
        }
    }
})

class BookmarkItem {
    constructor(bookmarkTreeNode) {
        this.title = bookmarkTreeNode.title;
        this.url = bookmarkTreeNode.url;
        this.faviconUrl = 'chrome://favicon/' + bookmarkTreeNode.url;
        this.id = bookmarkTreeNode.id;
    }
}