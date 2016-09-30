$(document).ready(function() {

  var month = ["January", "February", "Mach", "April", "May", "June", "July", "August", "September", "October", "November", "September"];

  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var ListStore = {
    state: {
      items: [
        {text: 'Great todo app With Vue.js', status: 'undone', label: 'important', isEditing: false},
        {text: 'Hello, Vue.js', status: 'undone', label: 'normal', isEditing: false}
      ]
    },
    newItem: function(text, status, label) {
      this.state.items.unshift({text: text, status: status, label: label, isEditing: true});
    }
  }

  var Header = Vue.extend({
    template: '#todo-header',
    props: ['items'],
    data: function() {
      return {
        date: '',
        weekDay: '',
        month: '',
        year: ''
      }
    },
    ready: function() {
      var d = new Date();
      this.date = d.getDate();
      this.weekDay = weekday[d.getDay()];
      this.month = month[d.getMonth()];
      this.year = d.getFullYear();
    },
    methods: {
      add: function() {
        ListStore.newItem('', 'undone', 'normal')
      }
    },
  });


  var Report = Vue.extend({
    template: '#todo-report',
    data: function() {
      return {
        listState: ListStore.state
      }
    },
    computed: {
      taskDone: function() {
        var total = 0;
        if(this.listState.items.length > 0) {
          for(var i = 0; i < this.listState.items.length; i++) {
            if(this.listState.items[i].status == "done"){
              total++;
            }
          }
        }
        return total;
      },
      taskTotal: function() {
        return this.listState.items.length;
      }
    }
  });

  var TodoItems = Vue.extend({
    template: '#todo-items',
    props: ['model'],
    data: function() {
      return {
        tempText: ''
      }
    },
    computed: {
      isDone: function() {
        return this.model.status == "done" ? true : false;
      }
    },
    methods: {
      save: function() {
        if(this.tempText != '') {
          this.model.isEditing = false;
          this.model.text = this.tempText;
        }
      },
      showAction: function(event) {
        event.stopPropagation();
        var target = $(event.currentTarget);
        var actionList = target.find('.action-list');

        if(actionList.hasClass('show')) {
          actionList.removeClass('show');
        }else {
          actionList.addClass('show');
        }
        // if end
      },
      showLabel: function(event) {
        event.stopPropagation();
        var target = $(event.currentTarget);
        var actionList = target.find('.label-popup');

        if(actionList.hasClass('show')) {
          actionList.removeClass('show');
        }else {
          actionList.addClass('show');
        }
      },
      changLabel: function(type) {
        this.model.label = type;
      },
      taskDone: function() {
        this.model.status = "done"
      },
      editing: function() {
        this.model.isEditing = true;
        this.$nextTick(function() {
          $(this.$el).find('input').focus();
        });
      },
      delete: function() {
        this.$dispatch('item-delete',this.model);
      }
    }
  });

  var TodoList = Vue.extend({
    template: '#todo-list',
    props: ['collection'],
    components: {
      'todo-items': TodoItems,
    },
    events: {
      'item-delete': function(model) {
        this.collection.$remove(model);
      }
    }
  });


  var todo = new Vue ({
    el: '#app',
    data: function() {
      return {
        listState: ListStore.state
      }
    },
    components: {
      'todo-header': Header,
      'todo-report': Report,
      'todo-list': TodoList,
    }
  })


});
