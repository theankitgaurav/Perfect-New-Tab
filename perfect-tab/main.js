// Frequent Sites logic
var frequentSitesArray = []
chrome.topSites.get(function(callback) {
    for (var i = 0; i < 20; i++) {
        frequentSitesArray.push({ 'title': callback[i].title, 'url': callback[i].url, 'faviconUrl': 'chrome://favicon/' + callback[i].url })
    }
})
var f_sites = new Vue({
    el: '#f_sites',
    data: {
        app_name: 'Frequent Sites',
        frequentSitesArray: frequentSitesArray
    }
})

// Recent Bookmarks logic
var recentBookmarksArray = []
chrome.bookmarks.getRecent(20, function(callback) {
    for (var i = 0; i < 20; i++) {
        recentBookmarksArray.push({ 'title': callback[i].title, 'url': callback[i].url, 'faviconUrl': 'chrome://favicon/' + callback[i].url })
    }
})
var r_bookmarks = new Vue({
    el: '#r_bookmarks',
    data: {
        app_name: 'Recent Bookmarks',
        recentBookmarksArray: recentBookmarksArray
    }
})

// ToDo list logic
// Todo: Make the following code more Vue-style
var todoStorage = {
    save: function(todos) {
        chrome.storage.sync.set({ 'chromeTodoItems': todos }, function() {
            if (chrome.runtime.lastError) {
                console.error('Runtime lastError while saving data to chrome storage')
            }
        })
    }
}
var todos_app = new Vue({
    el: '#todos_app',
    data: {
        app_name: 'Todos',
        todos: [],
        todoText: '',
        doneItems: []
    },
    watch: {
        todos: {
            deep: true,
            handler: function(todos) {
                todoStorage.save(todos)
            }
        }
    },
    created: function() {
        var self = this
        chrome.storage.sync.get('chromeTodoItems', function(items) {
            if (!chrome.runtime.lastError) {
                if (items.chromeTodoItems != null) {
                    self.todos = items.chromeTodoItems
                } else {
                    console.log('No todo items in Chrome Storage')
                }
            } else {
                console.error("Runtime Error while fetching data from Chrome Storage")
            }
        })
        self.todos.forEach(function(todo, index) {
            todo.id = index
        })
        todoStorage.uid = self.todos.length
    },
    methods: {
        addTodo: function(todoText) {
            var text = this.todoText && this.todoText.trim()
            if (text == '') {
                todoText = ''
                return
            }
            var todo = {
                'todoId': todoStorage.uid++,
                'text': text,
                'done': false,
                'timeAdded': Date.now()
            }
            this.todos.push(todo)
            this.todoText = ''
        },
        checkItems: function() {
            document.getElementById('trash').style.visibility = 'visible'
        }
    }
})

// Footer logic
var footer = new Vue({
    el: '#footer',
    methods: {
        restorePreviousSession: function() {
            chrome.sessions.restore()
        },
        openHistory: function() {
            chrome.tabs.update({ 'url': 'chrome://history' })
        },
        openSettings: function() {
            chrome.tabs.update({ 'url': 'chrome://settings' })
        },
        openBookmarks: function() {
            chrome.tabs.update({ 'url': 'chrome://bookmarks', 'selected': true })
        },
        openChromeApps: function() {
            chrome.tabs.update({ 'url': 'chrome://apps' })
        },
        openDownloads: function() {
            chrome.tabs.update({ 'url': 'chrome://downloads' })
        }
    }
})
