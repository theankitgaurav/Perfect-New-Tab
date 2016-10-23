//Frequent Sites logic
var fsArr = [];
chrome.topSites.get(function(callback) {
    for (var i = 0; i < 20; i++) {
        fsArr.push({ "title": callback[i].title, "url": callback[i].url, "faviconUrl": "chrome://favicon/" + callback[i].url });
    }
})
var f_sites = new Vue({
    el: "#f_sites",
    data: {
        app_name: "Frequent Sites",
        fsArr: fsArr
    }
})


//Recent Bookmarks logic
var rbArr = [];
chrome.bookmarks.getRecent(20, function(callback) {
    for (var i = 0; i < 20; i++) {
        rbArr.push({ "title": callback[i].title, "url": callback[i].url, "faviconUrl": "chrome://favicon/" + callback[i].url });
    }
})
var r_bookmarks = new Vue({
    el: "#r_bookmarks",
    data: {
        app_name: "Recent Bookmarks",
        rbArr: rbArr
    }
})


//ToDo list logic
var todos_app = new Vue({
    el: "#todos_app",
    data: {
        app_name: "Todos",
        STORAGE_KEY: "perfect-tab-todos",
        todosArr: JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'),
        todoText: ""
    },
    watch: {
        todosArr: {
            deep: true,
            handler: this.save
        }
    },
    methods: {
        addTodo: function(todoText) {
            var text = this.todoText && this.todoText.trim();
            if (text == "") {
                todoText = "";
                return;
            }
            var todo = {
                "id": this.todosArr.length + 1,
                "text": text,
                "done": false,
                "timeAdded": Date.now()
            }
            this.todosArr.push(todo)
            this.todoText = "";
            this.save(this.todosArr);
        },
        save: function(todos) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
        }
    }
})

//Footer logic
var footer = new Vue({
    el: "#footer",
    methods: {
        restorePreviousSession: function() {
            chrome.sessions.restore();
        },
        openHistory: function() {
            chrome.tabs.update({ 'url': 'chrome://history' });
        },
        openSettings: function() {
            chrome.tabs.update({ 'url': 'chrome://settings' });
        },
        openBookmarks: function() {
            chrome.tabs.update({ 'url': 'chrome://bookmarks', 'selected': true });
        },
        openChromeApps: function() {
            chrome.tabs.update({ 'url': 'chrome://apps' });
        },
        openDownloads: function() {
            chrome.tabs.update({ 'url': 'chrome://downloads' });
        }
    }
})
