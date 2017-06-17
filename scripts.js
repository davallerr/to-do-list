// to-do list web app

////////////////////////////////////////////////
// TASKS CONTROLLER
////////////////////////////////////////////////
var tasksController = (function() {

  // prototype task object
  var Task = function(id, list, description, due) {
    this.id = id,
    this.list = list,
    this.description = description,
    this.date = date
  };

  // calculate current date
  Task.prototype.getDate = function() {
    var date, dd, mm, yyyy;

    date = new Date();
    dd = today.getDate();
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();

    if(dd < 10) { dd = '0' + dd; }
    if(mm < 10) { mm = '0' + mm; }

    date = mm + '/' + dd + '/' + yyyy;
  }

  var data = {
    allTasks: [],
    lists: []
  }

  return {

    addTask: function(list, des, date) {
      var newTask, ID;

      if (data.allTasks.length > 0) {
        ID = data.allTasks[data.allTasks.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newTask = Task(ID, list, des, date);

      data.allTasks.push(newItem);
      return newItem;
    },

    // budgety delete to cannibalize
    /*
    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    */

    testing: function() {
      console.log(data);
    }

  }

})();


////////////////////////////////////////////////
// UI CONTROLLER
////////////////////////////////////////////////
var UIController = (function() {

})();


////////////////////////////////////////////////
// APP CONTROLLER
////////////////////////////////////////////////
var controller = (function(taskCtrl, UICtrl) {

})(tasksController, UIController);

// and then it go
controller.init();
