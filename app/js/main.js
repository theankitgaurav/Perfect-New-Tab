var myMixin = {
    methods: {
        openLink: function (url) {
            chrome.tabs.update({ 'url': url, 'selected': true })
        }
    }
}

class TopSite {
    constructor(title, url, hidden=false) {
        this.title = title;
        this.url = url;
        this.faviconUrl = `chrome://favicon/${url}`;
        this.hidden = hidden;
    }
}

const HIDDEN_TOPSITES = 'PNT_Hidden_Topsites';
class BookmarkItem {
    constructor(bookmarkTreeNode) {
        this.title = bookmarkTreeNode.title;
        this.url = bookmarkTreeNode.url;
        this.faviconUrl = 'chrome://favicon/' + bookmarkTreeNode.url;
        this.id = bookmarkTreeNode.id;
    }
}

// Frequent Sites logic
var f_sites = new Vue({
    el: '#f_sites',
    mixins: [myMixin],
    data: {
        frequentSitesArray: [],
        hiddenTopSites: []
    },
    created: function() {
        this.getHiddenTopSites(this.getFrequentSites);
    },
    watch: {
        hiddenTopSites: {
            deep: true,
            handler: function (hiddenTopSites) {
                chrome.storage.sync.set({HIDDEN_TOPSITES: hiddenTopSites}, function() {
                    if (chrome.runtime.lastError) {
                        console.error ('Runtime lastError while saving data to chrome storage', chrome.runtime.lastError)
                    }
                })
            }
        }
    },
    methods: {
        getFrequentSites: function() {
            chrome.topSites.get((topSites = []) => {
                this.frequentSitesArray = topSites
                .map(el =>{
                    return new TopSite(el.title, el.url);
                })
                .filter(el => {
                    return !this.hiddenTopSites.includes(el.url);
                });
                console.log('this.frequentSitesArray: ' , this.frequentSitesArray)
            });
        },
        getHiddenTopSites: function (cb) {
            chrome.storage.sync.get(HIDDEN_TOPSITES, function(items) {
                this.hiddenTopSites = items;
                cb();
            })
        },
        hide: function(url) {
            this.hiddenTopSites.push(url);
        }
    }
})

// Recent Bookmarks logic
var r_bookmarks = new Vue({
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

// ToDo list logic

class TodoItem {
    constructor (todoText, done = false) {
        this.text = todoText;
        this.done = done;
        this.timeAdded = new Date();
    }
}

var todoStorage = {
    save: function(todos) {
        chrome.storage.sync.set({ 'perfect_new_tab_todos': todos }, function() {
            if (chrome.runtime.lastError) {
                throw ('Runtime lastError while saving data to chrome storage')
            }
        })
    }
}
var todos_app = new Vue({
    el: '#todos_app',
    data: {
        app_name: 'Todos',
        todos: [],
        todoText: ''
    },
    watch: {
        todos: {
            deep: true,
            handler: function(todos) {
                todoStorage.save(todos)
            }
        }
    },
    computed: {
        pendingTodos: function() {
            return this.todos.filter(el => !el.done);
        },
        doneTodos: function () {
            return this.todos.filter(el => !!el.done);
        }

    },
    created: function() {
        var self = this
        chrome.storage.sync.get('perfect_new_tab_todos', function(items) {
            if (chrome.runtime.lastError) {
                console.error("Runtime Error while fetching data from Chrome Storage", chrome.runtime.lastError);
            } else {
                self.todos = items.perfect_new_tab_todos || [];   
            }
        })
    },
    methods: {
        addTodo: function(todoText) {
            var text = this.todoText && this.todoText.trim();
            if (!!text) {
                this.todos.unshift(new TodoItem(text));
            }
            this.todoText = '';
        },
        checkItems: function() {
            document.getElementById('trash').style.visibility = 'visible'
        },
        deleteItems: function(){
            this.todos = this.todos.filter(function(el){
                return el.done === false
            })
        }
    }
})

// Footer logic
var footer = new Vue({
    el: '#footer',
    mixins: [myMixin],
})