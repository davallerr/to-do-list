// to-do list web app

////////////////////////////////////////////////
// TASKS CONTROLLER
////////////////////////////////////////////////
var tasksController = (function() {

  // prototype task object
  var Task = function(date, description, id, list) {
    this.date = date,
    this.description = description,
    this.id = id,
    this.list = list
  };

  var data = {
    allTasks: [],
    lists: [],
    idBank: 0
  }

  var setDate = function() {
    var date, dd, mm, yyyy;

    var today = new Date();
    dd = today.getDate();
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();

    if(dd < 10) { dd = '0' + dd; }
    if(mm < 10) { mm = '0' + mm; }

    date = mm + '/' + dd + '/' + yyyy;
    return date;
  }

  // RETURNED PUBLIC FUNCTIONS
  return {

    addTask: function(des, list) {
      var date, id, newTask;

      date = setDate();
      id = data.idBank + 1;
      newTask = new Task(date, des, id, list);

      data.allTasks.push(newTask);
      console.log(newTask);
      data.idBank++;
      return newTask;
    },

    deleteTask: function(id) {
      var ids, index;

      ids = data.allTasks.map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allTasks.splice(index, 1);
      }
    },

    testing: function() {
      console.log(data);
    }

  };

})();


////////////////////////////////////////////////
// UI CONTROLLER
////////////////////////////////////////////////
var UIController = (function() {

  var DOMstrings = {
    currentList: '.top__list-current',
    inputDescription: '.add-task--input',
    addTaskBtn: '.add-task--btn',
    tasksList: '.tasks-list'
  }

  // RETURNED PUBLIC FUNCTIONS
  return {

    getInput: function() {
      return {
        list: document.querySelector(DOMstrings.currentList).innerHTML,
        description: document.querySelector(DOMstrings.inputDescription).value
      };
    },

    addListTask: function(obj) {
      var element, html, newHtml;

      element = DOMstrings.tasksList;

      // create html with placeholder
      html = "<div id='task-%id%' class='task'><div class='task__description'>%description%</div><div class='task__date'>%date%</div><div class='task__delete'><button class='task__delete--btn'>delete</button></div></div>";

      // replace placeholder
      newHtml = html.replace('%date%', obj.date);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%id%', obj.id);

      // insert html into dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearInput: function() {
      document.querySelector(DOMstrings.inputDescription).value = '';
      document.querySelector(DOMstrings.inputDescription).focus();
    },

    deleteListTask: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    getDOMstrings: function() {
      return DOMstrings;
    }

  };

})();


////////////////////////////////////////////////
// APP CONTROLLER
////////////////////////////////////////////////
var controller = (function(tasksCtrl, UICtrl) {

  var setupListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.addTaskBtn).addEventListener('click', ctrlAddTask);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddTask();
      }
    });

    document.querySelector(DOM.tasksList).addEventListener('click', ctrlDeleteTask);
  };

  var ctrlAddTask = function() {
    var input, newTask;

    // get input data
    input = UICtrl.getInput();

    if(input.description) {
      // add task to tasks controller
      newTask = tasksCtrl.addTask(input.description, input.list);

      // add item to list UI and clear input
      UICtrl.addListTask(newTask);
      UICtrl.clearInput();
    }
  };

  var ctrlDeleteTask = function(event) {
    var splitID, taskID, id;

    taskID = event.target.parentNode.parentNode.id;

    if(taskID) {
      splitID = taskID.split('-');
      id = parseInt(splitID[1]);
      // delete task from data
      tasksCtrl.deleteTask(id);
      // delete task from ui
      UICtrl.deleteListTask(taskID);
    }
  };

  // RETURNED PUBLIC FUNCTIONS
  return {

    init: function() {
      console.log('init');
      setupListeners();
      document.querySelector('.add-task--input').focus();
    }

  }

})(tasksController, UIController);

// and then it go
controller.init();
