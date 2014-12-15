// simple-todos.js
Tasks = new Mongo.Collection("matrix");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    matrix: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.body.events({
    "submit .new-task": function (event) {
      event.preventDefault();

      var r = event.target.row.value;
          c = event.target.col.value;
      var multiply = r * c;
      var m = [];
      for (var i = 0; i < r * c; i++){
      	m[i] = i;
      }
      Tasks.insert({
        row: r,
        col: c,
        multiply: multiply,
        matrix_array: m,
      });

      // Clear form
      event.target.row.value = "";
      event.target.col.value = "";


      // Prevent default form submit
      return false;
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

  Template.task.helpers({
    "hellothere": function() {
      console.log("The result of " + this.multiply + " mod " + this.matrix_array + " is " + (this.multiply % (this.matrix_array + 1) == 0));
      return (this.multiply % (this.matrix_array + 1) == 0);
    }
  });
}