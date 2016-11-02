// Frequent Sites logic
var fsArr = []
chrome.topSites.get(function(callback) {
    for (var i = 0; i < 20; i++) {
        fsArr.push({ 'title': callback[i].title, 'url': callback[i].url, 'faviconUrl': 'chrome://favicon/' + callback[i].url })
    }
})
var f_sites = new Vue({
    el: '#f_sites',
    data: {
        app_name: 'Frequent Sites',
        fsArr: fsArr
    }
})

// Recent Bookmarks logic
var rbArr = []
chrome.bookmarks.getRecent(20, function(callback) {
    for (var i = 0; i < 20; i++) {
        rbArr.push({ 'title': callback[i].title, 'url': callback[i].url, 'faviconUrl': 'chrome://favicon/' + callback[i].url })
    }
})
var r_bookmarks = new Vue({
    el: '#r_bookmarks',
    data: {
        app_name: 'Recent Bookmarks',
        rbArr: rbArr
    }
})

// ToDo list logic
var STORAGE_KEY = 'chromeTodoItems'
var todoStorage = {
    save: function(todos) {
        chrome.storage.sync.set({ 'chromeTodoItems': todos }, function() {
            if (chrome.runtime.lastError) {
                console.error('Runtime Error')
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
                //console.log(todos)
                todoStorage.save(todos)
            }
        }
    },
    created: function() {
        var self = this
        chrome.storage.sync.get('chromeTodoItems', function(items) {
            if (!chrome.runtime.lastError) {
                self.todos = items.chromeTodoItems
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
            console.log(this.todos)
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
