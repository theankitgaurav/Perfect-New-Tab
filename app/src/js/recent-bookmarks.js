class BookmarkItem {
    constructor(bookmarkTreeNode) {
        this.title = bookmarkTreeNode.title;
        this.url = bookmarkTreeNode.url;
        this.faviconUrl = 'chrome://favicon/' + bookmarkTreeNode.url;
        this.id = bookmarkTreeNode.id;
    }
}

const MIN_ITEMS = 20
const MAX_ITEMS = 1000;

const RecentBookmarksComponent = new Vue({
    el: '#recent-bookmarks',
    mixins: [myMixin],
    data: {
        recentBookmarksArray: [],
        defaultNumberOfItems: MIN_ITEMS,
        showAll: false
    },
    watch: {
        showAll: function(showAll) {
            this.defaultNumberOfItems = (!!showAll) ? MAX_ITEMS : MIN_ITEMS;
            this.getRecentBookmarks();
        }
    },
    created: function() {
        this.getRecentBookmarks();
    },
    methods: {
        deleteItem: function(bookmarkId) {
            chrome.bookmarks.remove(bookmarkId);
            this.getRecentBookmarks();
        },
        getRecentBookmarks: function() {
            const self = this
            chrome.bookmarks.getRecent(self.defaultNumberOfItems, (results) => {
                self.recentBookmarksArray = results.map(el=> new BookmarkItem(el));
            })
        }
    }
})