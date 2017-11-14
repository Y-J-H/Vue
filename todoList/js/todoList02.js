(function () {
    var visibility = location.hash.substr(location.hash.indexOf('/') + 1);
    visibility = visibility === '' ? 'all' : visibility
    var filters = {
        all: function (todos) {
            return todos;
        },
        active: function (todos) {
            return todos.filter(function (todo) {
                return !todo.checked;
            });
        },
        completed: function (todos) {
            return todos.filter(function (todo) {
                return todo.checked;
            });
        }
    };

    // 注册一个全局自定义指令 v-focus
    Vue.directive('focus', {
        // 当绑定元素插入到 DOM 中。
        inserted(el) {
            // 聚焦元素
            el.focus()
        },
        // 当绑定元素更新的时候
        update(el) {
            el.focus();
        }
    })

    // 创建头部组件
    let todoListHead = {
        data() {
            return {
                newTodo: ''    // 用于临时存储任务的名称
            }
        },
        template:  ` <header class="header">
                        <h1>todos</h1>
                        <input class="new-todo" placeholder="你接下来需要完成什么?" autofocus=""
                         v-model="newTodo" @keyup.enter.trim="addTodo" />
                      </header>`,
        methods: {
            addTodo() {
                // 去除前后的空格
                this.newTodo = this.newTodo.trim();
                //如果内容为空则拦截
                if (this.newTodo.length < 1) {
                    return;
                }
                this.$emit('add-todo-root', this.newTodo);
                // 清空新任务的内容
                this.newTodo = ''
            },
        }
    }


    let todoapp = new Vue({
        // 挂载元素
        el: '.todoapp',
        // 数据,存放所有你发布的任务的数据
        data: {
            visibility: visibility,
            // 正在编辑的任务索引
            editingIndex: -1,
            // newTodo: '', // 用于临时存储任务的名称
            todoList: todoStorage.fetch()
        },
        // 方法
        methods: {
            addTodoRoot(text){
                 // 添加任务到数组中,默认是未完成
                 this.todoList.unshift({
                    text,
                    checked: false
                });
                console.log(111);
            },
            deleteTodo(todo) {
                this.todoList = _.without(this.todoList, todo) // _.without是underscore中的方法
            },
            // 编辑任务
            editTodo(index) {
                // 设置一下当前正在编辑的索引
                this.editingIndex = index;
            },
            // 保存任务，因为是动态绑定的，不需要再保存，只需要把input框隐藏即可
            saveTodo(todo) {
                this.editingIndex = -1
                if (todo.text.trim().length < 1) {
                    this.deleteTodo(todo)
                }
            },
            // 清空已完成的任务列表
            clearCompleted() {
                this.todoList = filters.active(this.todoList)
            }
        },
        // 计算属性
        computed: {
            showList() {
                return this.todoList.length > 0;
            },
            // 未完成的任务数量
            activeCount() {
                return filters.active(this.todoList).length;
            },
            allDone: {
                get() {
                    // 未完成的数量为0表示全部完成,全部完成返回true
                    return this.activeCount === 0;
                },
                set(value) {
                    this.todoList.forEach(todo => {
                        todo.checked = value
                    });
                }
            },
            // 过滤任务列表
            filteredTodoList: function () {
                return filters[this.visibility](this.todoList);
            },
            // 已完成的任务数量
            completedCount() {
                return filters.completed(this.todoList).length;
            }

        },
        // 观察者
        watch: {
            todoList: {
                deep: true,
                handler: todoStorage.save
            }
        },

        // 组件
        components: {
            todoListHead
        }
    })


})();