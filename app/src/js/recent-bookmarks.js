class BookmarkItem {
    constructor(bookmarkTreeNode) {
        this.title = bookmarkTreeNode.title;
        this.url = bookmarkTreeNode.url;
        this.faviconUrl = 'chrome://favicon/' + bookmarkTreeNode.url;
        this.id = bookmarkTreeNode.id;
    }
}

const RecentBookmarksComponent = new Vue({
    el: '#recent-bookmarks',
    mixins: [myMixin],
    data: {
        recentBookmarksArray: [],
    },
    created: function() {
        this.getRecentBookmarks()
    },
    methods: {
        deleteItem: function(bookmarkId) {
            chrome.bookmarks.remove(bookmarkId);
            this.getRecentBookmarks();
        },
        getRecentBookmarks: function() {
            const self = this
            const MAX_BOOKMARKS = 999;
            chrome.bookmarks.getRecent(MAX_BOOKMARKS, (results) => {
                self.recentBookmarksArray = results.map(el=> new BookmarkItem(el));
            })
        }
    }
})