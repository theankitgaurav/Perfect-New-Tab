class TodoItem {
    constructor (todoText, done = false) {
        this.text = todoText;
        this.done = done;
        this.timeAdded = new Date();
    }
}

const TodosComponent = new Vue({
    el: '#todos_app',
    data: {
        app_name: 'Todos',
        todos: [],
        todoText: ''
    },
    watch: {
        todos: {
            deep: true,
            handler: function(updatedTodos) {
                this.save(updatedTodos);
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
        deleteItems: function(){
            this.todos = this.todos.filter(function(el){
                return el.done === false
            })
        },
        save: function(todos) {
            chrome.storage.sync.set({ 'perfect_new_tab_todos': todos }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error saving data to chrome storage', chrome.runtime.lastError)
                }
            })
        }
    }
})