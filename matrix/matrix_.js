Matrices = new Mongo.Collection("matrix");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    matrix: function () {
      return Matrices.find({});
    }
  });

  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.body.events({
    "submit .new-task": function (event) {

      var r = event.target.row.value;
          c = event.target.col.value;

      Matrices.insert({
        row: r,
        col: c
      });

      // Clear form
      event.target.row.value = "";
      event.target.col.value = "";

      // Prevent default form submit
      return false;
    }
  });
  Template.createInput.helpers({
    addTable: function() {
      var matrix = document.getElementById("newmatrix");
      var table = document.createElement('TABLE');
      table.border='1';
      
      var tableBody = document.createElement('TBODY');
      table.appendChild(tableBody);
        
      for (var i = 0; i < this.row; i++){
         var tr = document.createElement('TR');
         tableBody.appendChild(tr);
         
         for (var j = 0; j < this.col; j++){
             var td = document.createElement('TD');
             td.setAttribute("contenteditable",true)
             td.width='5';
             td.appendChild(document.createTextNode(i + "," + j));
             tr.appendChild(td);
         }
      }
      matrix.appendChild(table);
    }
  });
  Template.createInput.events({
    "click .delete": function () {
      Matrices.remove(this._id);
    }
  });
}