class TodoItem {
    constructor (todoText, done = false) {
        this.text = todoText;
        this.done = done;
        this.deleted = false;
        this.timeAdded = Date.now();
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
            return this.todos.filter(el => !el.done && !el.deleted);
        },
        doneTodos: function () {
            return this.todos.filter(el => !!el.done && !el.deleted);
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
            const filteredTodos = todos.filter(el => !el.deleted); // Filter out the items marked as deleted before saving
            console.log(filteredTodos)
            chrome.storage.sync.set({ 'perfect_new_tab_todos': filteredTodos }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error saving data to chrome storage', chrome.runtime.lastError)
                }
            })
        }
    }
})