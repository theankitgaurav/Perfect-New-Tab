//Controllers logic here
var app = angular.module('newTab', []);
//Configuration to whitelist favicon src
app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|chrome):/);
}]);
//Frequent Sites logic
app.controller('frequentSitesController', function($scope) {
    $scope.frequent_sites = [];
    chrome.topSites.get(function(callback) {
        for (var i = 0; i < 20; i++) {
            $scope.frequent_sites.push({ "title": callback[i].title, "url": callback[i].url });
        }
    })
});
//Recent Bookmarks logic
app.controller('recentBookmarksController', function($scope) {
    $scope.recent_bookmarks = [];
    chrome.bookmarks.getRecent(20, function(callback) {
        for (var i = 0; i < 20; i++) {
            $scope.recent_bookmarks.push({ "title": callback[i].title, "url": callback[i].url });
            $scope.$apply()
        }
    })
});
//ToDo list logic
app.controller('todosController', function($scope) {
    $scope.todos = [];
    chrome.storage.sync.get('todoitems', function(keys) {
            if (keys.todoitems != null) {
                $scope.todos = keys.todoitems;
                $scope.$apply()
            }
        })
        //function to sync with chrome storage
    $scope.updateStorage = function() {
            chrome.storage.sync.set({ 'todoitems': $scope.todos }, function() {});
        }
        //function to add items
    $scope.addTodo = function() {
            var id = $scope.todos.length + 1;
            var text = $scope.todoText;
            var todo = {
                "id": id,
                "text": text,
                "done": false,
                "timeAdded": new Date()
            }
            $scope.todos.push(todo);
            $scope.todoText = "";
            $scope.updateStorage();
        }
        //function to clear done items
    $scope.clearDone = function() {
        var oldTodos = $scope.oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (todo.done === false) $scope.todos.push(todo);
        });
        $scope.updateStorage();
        document.getElementById("trash").style.visibility = "hidden"
    };
    //function for calculating total todos 
    $scope.getTotalTodos = function() {
        return $scope.todos.length;
    };

    $scope.todoChange = function(id) {
        document.getElementById("trash").style.visibility = "visible";
    }
});
//Footer logic
app.controller('footerController', function($scope) {
    $scope.openHistory = function() {
        chrome.tabs.update({ 'url': 'chrome://history' });
    }
    $scope.openDownloads = function() {
        chrome.tabs.update({ 'url': 'chrome://downloads' });
    }
    $scope.openSettings = function() {
        chrome.tabs.update({ 'url': 'chrome://settings' });
    }
    $scope.openBookmarks = function() {
        chrome.tabs.update({ 'url': 'chrome://bookmarks', 'selected': true });
    }
    $scope.restorePreviousSession = function() {
        chrome.sessions.restore();
    }
    $scope.openChromeApps = function() {
        chrome.tabs.update({ 'url': 'chrome://apps' });
    }
});
