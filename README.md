#Vue
##利用Vue实现一个todoList

上一次我介绍了，Vue的一些基本用法, 这一次我们使用我们上一次我们介绍过的有关Vue的知识来写一个todlList。
###什么是todoList
ToDoList是一款非常优秀的任务管理软件，用户可以用它方便地组织和安排计划。该软件短小精悍，仅有一个 数百 KB 的可执行文件就能完成所有功能，并且界面设计优秀，初级用户也能够快速上手,简单的说就是类似与一个记事本的东西。具体大家可以查看：
http://todomvc.com/examples/vanilla-es6/

###项目准备
首先我们创建一个todoList文件夹来存放我们的项目，然后在我们的到我们的文件夹中右击，点git bash,( 没有安装git的话是没有git bash的，可以先去安装一下，具体教程请百度 )。输上一下命令：
```
npm init -y
npm i -S underscore vue todomvc-app-css
```
underscore：我们可能会用到里面的一些方法
todomvc-app-css：这个是别人给我们写好的todoList的样式
在再这个文件夹下创建一个todoList.html，写上一下代码
```
  <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus="">
        </header>
        <section class="main" style="display: block;">
            <input class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                <li data-id="1510236147548" class="">
                    <div class="view">
                        <input class="toggle" type="checkbox">
                        <label>ad</label>
                        <button class="destroy"></button>
                    </div>
                </li>
            </ul>
        </section>
        <footer class="footer" style="display: block;">
            <span class="todo-count">
                <strong>1</strong> item left</span>
            <ul class="filters">
                <li>
                    <a href="#/" class="selected">All</a>
                </li>
                <li>
                    <a href="#/active">Active</a>
                </li>
                <li>
                    <a href="#/completed">Completed</a>
                </li>
            </ul>
            <button class="clear-completed" style="display: none;"></button>
        </footer>
    </section>
```
引入todomvc-app-css，underscore,vue.js
```
<link rel="stylesheet" href="./node_modules/todomvc-app-css/index.css">
<script src="./node_modules/vue/dist/vue.js"></script>
<script src="./node_modules/underscore/underscore-min.js"></script>
```
最后新建一个js文件夹和images文件夹，同时在js文件夹里面写一个todoList.js注意不要忘了引入,这样我们项目的准备工作就完成了。

###第一步：先新建一个Vue实例对象
```
    let todoapp = new Vue({
        // 挂载元素
        el: '.todoapp',
        // 数据
        data: {
            newTodo： '',             // 用于临时存储任务的名称
            todoList: [
                {
                    text: '学习',     // 发布的任务的名称
                    checked: false    // 标识该任务是否以完成
                },
                {
                    text: '还是学习',
                    checked: false
                }
            ]
        },
        // 方法
        methods: {

        },
        // 计算属性
        computed: {

        },
        // 观察者
        watch: {

        }
    })
```
这里在todoList里面加两条数据，主要就是显示一下，方便等会改，删。
### 显示任务
在`<ul class="todo-list"> ... </ul>`这个ul里面加上下面代码,可以删了原来的li
```
<li v-for="(todo,index) in todoList" :key="'todo-' + index">
    <input class="toggle" type="checkbox">
    <label>{{ todo.text }}</label>
    <button class="destroy"></button>
</li>
```
给上面的li元素动态绑定class,因为任务完成和没完成的样式是不同的,同时给li下面的checkbox加上v-model，让当前dom的值和在js中定义的checked绑定起来
```
<li :class="{completed: todo.checked}" v-for="(todo,index) in todoList" :key="'todo-'+index"
  >
<input class="toggle" type="checkbox" v-model="todo.checked"/>
```

### 添加任务
先将上面的newTodo和输入框input联系起来,同时绑定事件
```
<input class="new-todo" placeholder="你接下来需要完成什么?" autofocus="" v-model="newTodo" @keyup.enter="addTodo"/>
```
添加任务的方法(写在method中)
```
addTodo() {
  // 去除前后的空格
  this.newTodo = this.newTodo.trim();
  //如果内容为空则拦截
  if (this.newTodo.length < 1) {
    return;
  }
  // 添加任务到数组中,默认是未完成
  this.todoList.unshift({
    text: this.newTodo,
    checked: false
  });
  // 清空新任务的内容
  this.newTodo = ''
}
```
### 控制没有任务时隐藏,主体部分和底部
由于有没有任务是不确定的所以这里我们使用计算属性,在computed: {}中写上一下代码
js:
```
showList() {
    return this.todoList.length > 0;
  }
```
html:绑定计算属性
<section class="main" v-show="showList">
<footer class="footer" v-show="showList">

### 删除任务
在删除按钮上绑定一个deleteTodo方法`<button class="destroy" @click="deleteTodo(todo)"></button>`在method中写上一下代码：
```
 // 删除任务
  deleteTodo(todo) {
    this.todoList = _.without(this.todoList, todo)   // _.without是underscore中的方法
  }
```

### 编辑任务
在<div class="view"></div>外部添加上`<label @dblclick="editTodo(index)">{{ todo.text }}</label>`
例如：
```
<li :class="{completed: todo.checked, editing: index === editingIndex}" v-for="(todo,index) in todoList" :key="'todo-' + index">
       <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.checked">
            <label @dblclick="editTodo(index)">{{ todo.text }}</label>
            <button class="destroy" @click="deleteTodo(todo)"></button>
       </div>
       <input class="edit" type="text" v-model="todo.text" v-focus="index === editingIndex" />
 </li>
```
在method中添加编辑任务方法，同时在data中添加editingINdex： -1，
```
data: {
  // 正在编辑的任务索引
  editingIndex: -1,
  ...
}
```
```
data: {
  // 正在编辑的任务索引
  editingIndex: -1,
  ...
},
methods: {
  ...
  // 编辑任务
  editTodo(index) {
    // 设置一下当前正在编辑的索引
    this.editingIndex = index;
  }
}
```
给li加上相应的class
```
<li :class="{completed: todo.checked, editing: index === editingIndex}" v-for="(todo,index) in todoList":key="'todo-'+index"
  >
```
添加一个自定义指令
// 注册一个全局自定义指令 v-focus
```
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
```
使用该指令
```
<input class="edit" type="text" v-model="todo.text" v-focus="index === editingIndex"/>
```
### 修改后可以保存
```
<input class="edit" type="text" v-model="todo.text" v-focus="index === editingIndex" @blur="saveTodo(todo)" @keyup.enter="saveTodo(todo)"/>
```
保存的方法，写咋method中
```
// 保存任务，因为是动态绑定的，不需要再保存，只需要把input框隐藏即可
  saveTodo(todo) {
    this.editingIndex = -1
    if (todo.text.trim().length < 1) {
      this.deleteTodo(todo)
    }
  }
```

###显示未完成的数量,由于是变化的所以也应该用计算属性
```
computed: {
  ....
  // 未完成的任务数量
  activeCount() {
    return this.todoList.filter(item => {
      return !item.checked
    }).length;
  }
}
```
html部分的改动
```
<span class="todo-count">
    <strong>{{ activeCount }}</strong> item left
 </span>
```

### 将数据持久化到本地
新建一个store.js文件，写上一下代码，注意不要忘记引入,同时要引入在todoList.js之前
```
var STORAGE_KEY = 'todoList'
window.todoStorage = {
	fetch() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch(error) {
      return [];
    }
	},
	save(todoList) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
	}
}
```
fetch()：方法将数据获取到，因此这里在todoList的获取数据就要改了
```
data: {
  ...
  todoList: todoStorage.fetch()
}
```
当todoList里面的数据发生改变时我们就应该存储一下数据，因此自理我们使用了一个观察者模式
```
watch: {
  todoList: {
    deep: true,
    handler: todoStorage.save
  }
},
```
###添加一个计算属性
用于判断是否所有任务已完成，用来添加任务框前面的标识是否可以点击
```
computed: {
  ...
  // 是否所有任务都完成
  allDone: {
    get() {   // 获取allDone时触发
      // 未完成的数量为0表示全部完成,全部完成返回true
      return this.activeCount === 0;
    },
    set(value) {   // 改变allDone时触发
      this.todoList.forEach(todo => {
        todo.checked = value
      });
    }
  }
}
```
使用v-model绑定
`
<input class="toggle-all" id="toggle-all" type="checkbox" v-model="allDone" />
`
###实现所有，已完成，未完成功能的点击
这里在实例化Vue对象外面放一个普通的过滤对象，注意放在实例之前
```
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
```
添加一个visibility属性用于表示当前我们应该显示哪些任务默认为'all'
```
data: {
  visibility: 'all',
  ...
}
```
这样的话未完成的数量我们就可以简写了，
```
computed: {
  ...
  // 未完成的任务数量
  activeCount() {
    return filters.active(this.todoList).length;
  },
}
```
添加任务过滤属性：
```
computed: {
  ...
  // 过滤任务列表
  filteredTodoList: function () {
    return filters[this.visibility](this.todoList);
  }
}
```
现在我们使用folterTodoList来表示我们要显示的任务，所以原来的li列表渲染应该改变了

```
<li
  :class="{completed: todo.checked, editing: index === editingIndex}"
  v-for="(todo,index) in filteredTodoList" :key="'todo-'+index"
  >
```
在底部所有，未完成，已完成，这几个的结构因应该变化了
```
 <li>
     <a :class="{selected: visibility === 'all'}" href="#/" @click="visibility='all'">所有</a>
</li>
<li>
    <a :class="{selected: visibility === 'active'}" href="#/active" @click="visibility = 'active'">未完成</a>
</li>
 <li>
      <a :class="{selected: visibility === 'completed'}" href="#/completed" @click="visibility = 'completed'">已完成</a>
</li>
```
### 设置一个hash值和清已完成任务的功能
添加一个变量，得到hash值：
```
var visibility = location.hash.substr(location.hash.indexOf('/')+1);
visibility = visibility === '' ? 'all' : visibility
设置visibility属性的值为当前的这个变量：
data: {
  visibility: visibility,
  ...
}
```
添加了hash后我们刷新页面不会,每次都调回首页了
清空功能

computed: {
  ...
  // 已完成的任务数量
  completedCount() {
    return filters.completed(this.todoList).length;
  }
}
添加一个清空已完成的方法：
methods: {
  ...
  // 清空已完成的任务列表
  clearCompleted() {
    this.todoList = filters.active(this.todoList)
  }
}
DOM元素绑定事件，以及v-show:
<button class="clear-completed" @click="clearCompleted" v-show="completedCount > 0">清空已完成</button>
差不多写到这基本功能就实现了。




