class BookmarkItem {
    constructor(bookmarkTreeNode) {
        this.title = bookmarkTreeNode.title;
        this.url = bookmarkTreeNode.url;
        this.faviconUrl = 'chrome://favicon/' + bookmarkTreeNode.url;
        this.id = bookmarkTreeNode.id;
    }
}

const RecentBookmarksComponent = new Vue({
    el: '#r_bookmarks',
    mixins: [myMixin],
    data: {
        recentBookmarksArray: [],
        checkedItems: [],
        deleteMode: false
    },
    created: function() {
        this.getRecentBookmarks()
    },
    computed: {
      focusDeleteBtn: function(){
        return !this.deleteMode
      }
    },
    methods: {
        deleteCheckedBookmarks: function() {
          if(this.deleteMode === false){
            this.deleteMode = true
          } else {
            this.checkedItems.forEach(function(elem){
              chrome.bookmarks.remove(elem)
            })
            this.checkedItems = []
            this.getRecentBookmarks()
            this.deleteMode = false
          }
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