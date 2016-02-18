//Controllers logic here
var app = angular.module('newTab', []);


//Frequent Sites logic
app.controller('frequentSitesController', function($scope){
	$scope.frequent_sites = []
	chrome.topSites.get(function(callback){
		for(var i=0; i<20; i++){
			$scope.frequent_sites.push({"title":callback[i].title, "url":callback[i].url});
		}
	})
});


//Recent Bookmarks logic
app.controller('recentBookmarksController', function($scope){
	chrome.bookmarks.getRecent(20, function (callback){
		for(var i=0; i<20; i++){
			$scope.recent_bookmarks.push({"title":callback[i].title, "url":callback[i].url});
		}
	})
});


//ToDo list logic
app.controller('todosController', function($scope) {
    $scope.todos = [{"id":1, "text":"Anku is cool", "done":false}, {"id":2, "text":"Make something awesome", "done":false}];
    chrome.storage.sync.get('todo', function(keys) {
    	if (keys.todo != null) {
                var data = keys.todo;
                for (var i=0; i<data.length; i++) {
                    data[i]['id'] = i + 1;
                }
            }
    	
    })

    $scope.addTodo = function(){
    	var id = $scope.todos.length+1;
    	var text = $scope.todoText;
    	var todo = {
    		"id" : id,
    		"text" : text,
    		"done" : false
    	}
    	$scope.todos.push(todo);
    	chrome.storage.sync.set({"todo": todo}, function() {
            console.log('Data is stored in Chrome storage');
        });
    	$scope.todoText = "";
    }

    //function to clear done items
    $scope.clearDone = function(){
    	var oldTodos = $scope.oldTodos = $scope.todos;
    	$scope.todos = [];
    	angular.forEach(oldTodos, function(todo){
    		if(todo.done == false) $scope.todos.push(todo);
    	});
    };
    //function for calculating total todos 
    $scope.getTotalTodos = function(){
    	return $scope.todos.length;
    }
    
});


//Footer logic
app.controller('footerController', function($scope){
	$scope.openHistory = function(){
		chrome.tabs.create({'url': 'chrome://history'});
	}
	$scope.openDownloads = function(){
		chrome.tabs.create({'url': 'chrome://downloads'});
	}
	$scope.openSettings = function(){
		chrome.tabs.create({'url': 'chrome://settings'});
	}
	$scope.openBookmarks = function(){
		chrome.tabs.create({'url': 'chrome://bookmarks'});
	}
	$scope.restorePreviousSession = function(){
		chrome.sessions.restore()
		// chrome.sessions.getRecentlyClosed(function (callback){
		// 	console.log(callback)
		// })
	}
});