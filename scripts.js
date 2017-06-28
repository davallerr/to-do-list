// to-do list web app

////////////////////////////////////////////////
////////////////////////////////////////////////
// TASKS CONTROLLER
////////////////////////////////////////////////
////////////////////////////////////////////////
var tasksController = (function() {

  // prototype task object
  var Task = function(date, description, id, list) {
    this.date = date,
    this.description = description,
    this.id = id,
    this.list = list
  };

  // data object housing all task information
  var data = {
    allTasks: [],
    lists: {
      'All Tasks': []
    },
    // id bank so every task has unique id, even when tasks are deleted
    idBank: 0
  };

  // function to return date at time called
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
  };

  // RETURNED PUBLIC FUNCTIONS
  return {

    addTask: function(des, list) {
      var date, id, newTask;

      // get date of task creation
      date = setDate();
      id = data.idBank + 1;
      newTask = new Task(date, des, id, list);

      // push task to allTasks array and list-specific array
      data.allTasks.push(newTask);
      data.lists[list].push(newTask);

      // iterate data id bank
      data.idBank++;

      return newTask;
    },

    deleteTask: function(id) {
      var allTasksIndex, ids, list, listIndex, listIndexes;

      // create allTasks indexes based off of task id
      ids = data.allTasks.map(function(current) { return current.id; });
      allTasksIndex = ids.indexOf(id);

      if(allTasksIndex !== -1) {
        list = data.allTasks[allTasksIndex].list;

        // create array of ids same length as data list array - indexes line up
        listIndexes = data.lists[list].map(function(current) { return current.id; });
        console.log(listIndexes);
        listIndex = listIndexes.indexOf(id);

        // delete task from allTasks and specific list arrays
        data.allTasks.splice(allTasksIndex, 1);
        data.lists[list].splice(listIndex, 1);
      }
    },

    addList: function(newList) {
      data.lists[newList] = [];
      return newList;
    },

    checkList: function(id) {
      // take task id and return that task's list property
      var task;

      task = data.allTasks.filter(function(current) {
        return current.id === id;
      });

      return task[0].list;
    },

    deleteList: function(currentList) {
      var confirmListDelete, removeIDs;

      // can't delete All Tasks list and confirm delete
      if(currentList !== 'All Tasks') {
        confirmListDelete = confirm('delete this list and all tasks therein?');
        if(confirmListDelete) {
          // delete currentList in data
          delete data.lists[currentList];

          // create array of ids to remove by checking their list
          removeIDs = data.allTasks.map(function(item) {
            if(item.list === currentList) {
              return item.id;
            }
          });

          // perform for each id that needs to be deleted
          // goes through each task in allTasks and compares its id with id of task to be removed
          for(var i=0; i<removeIDs.length; i++) {
            if(removeIDs[i]) {
              for(var j=0; j<data.allTasks.length; j++) {
                if(removeIDs[i] === data.allTasks[j].id) {
                  data.allTasks.splice(j, 1);
                }
              }
            }
          }
        }
      }
    },

    testing: function() {
      console.log(data);
    }

  };

})();


////////////////////////////////////////////////
////////////////////////////////////////////////
// UI CONTROLLER
////////////////////////////////////////////////
////////////////////////////////////////////////
var UIController = (function() {

  var DOMstrings = {
    addListBtn: '.top__list-add--btn',
    addTaskBtn: '.add-task--btn',
    currentList: '.top__list-current',
    deleteListBtn: '.top__list-delete--btn',
    inputDescription: '.add-task--input',
    listSelect: '.top__list-select',
    listOption: '.top__list-option',
    taskItem: '.task',
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

    getNewList: function() {
      var newList;
      newList = prompt('name your new list');
      return newList;
    },

    addListOption: function(newList) {
      var html, newHtml;

      html = "<option class='top__list-option'>%list%</option>";
      newHtml = html.replace('%list%', newList);

      document.querySelector(DOMstrings.listSelect).insertAdjacentHTML('beforeend', newHtml);
    },

    setListHeader: function(selectedList) {
      document.querySelector(DOMstrings.currentList).textContent = selectedList;
    },

    setListSelect: function(listSelect) {
      var options, select;

      select = document.querySelector(DOMstrings.listSelect);
      options = select.options;

      for(var i=0; i<select.length; i++ ) {
        console.log(options[i]);
        if(options[i].value === listSelect) {
          select.selectedIndex = i;
          break;
        }
      }
    },

    clearTasksDisplay: function(selectedList) {
      var tasks;
      tasks = document.querySelectorAll(DOMstrings.taskItem);

      for(var i=0; i<tasks.length; i++) {
        tasks[i].style.display = 'none';
      }
    },

    filterTaskDisplay: function(taskList, selectedList, checkTask) {
      if(taskList === selectedList) {
        checkTask.style.display = 'block';
      } else if(selectedList === 'All Tasks') {
        checkTask.style.display = 'block';
      } else {
        checkTask.style.display = 'none';
      }
    },

    getCurrentList: function() {
      return document.querySelector(DOMstrings.currentList).textContent;
    },

    deleteListUpdateTasks: function(deleteList) {
      // remove dropdown option
      // remove tasks from allTasks display
      // set view to allTasks
    },

    getDOMstrings: function() {
      return DOMstrings;
    }

  };

})();

////////////////////////////////////////////////
////////////////////////////////////////////////
// APP CONTROLLER
////////////////////////////////////////////////
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
    document.querySelector(DOM.addListBtn).addEventListener('click', ctrlAddList);
    document.querySelector(DOM.listSelect).addEventListener('change', ctrlSetList);
    document.querySelector(DOM.deleteListBtn).addEventListener('click', ctrlDeleteList);
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

  var ctrlAddList = function() {
    var input, newList;

    // get input for new list
    input = UICtrl.getNewList();

    // check for new list input
    if(input) {
      // add list to data
      newList = tasksCtrl.addList(input);

      // add list to ui
      UICtrl.addListOption(newList);
      UICtrl.setListHeader(newList);
      UICtrl.clearTasksDisplay();

      // set dropdown to new list
      UICtrl.setListSelect(newList);
    }
  };

  var ctrlSetList = function() {
    var DOM, listSelector, selectedList, taskList, tasks;

    DOM = UICtrl.getDOMstrings();

    listSelector = document.querySelector(DOM.listSelect);
    selectedList = listSelector.options[listSelector.selectedIndex].value;

    // set list header in ui
    UICtrl.setListHeader(selectedList);

    tasks = document.querySelectorAll(DOM.taskItem);

    // loop through each task element
    for(var i=0; i<tasks.length; i++) {
      var tagID, splitID, id;

      // pull id from task
      tagID = tasks[i].id;
      splitID = tagID.split('-');
      id = parseInt(splitID[1]);

      // identify list of task
      taskList = tasksCtrl.checkList(id);

      // display if matches list, hide if not
      UICtrl.filterTaskDisplay(taskList, selectedList, tasks[i]);
    }
  };

  var ctrlDeleteList = function() {
    var currentList;

    // get name of current list
    currentList = UICtrl.getCurrentList();
    console.log(currentList);

    // delete list from data structure
    tasksCtrl.deleteList(currentList);

    // remove list from ui
    UICtrl.updateLists(currentList);
  }

  // RETURNED PUBLIC FUNCTIONS
  return {

    init: function() {
      console.log('init');
      setupListeners();
      document.querySelector('.add-task--input').focus();
    }

  }

})(tasksController, UIController);


////////////////////////////////////////////////
// and then it go
////////////////////////////////////////////////
controller.init();
