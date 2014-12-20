(function() {
	var app = angular.module('matrixCalc', []);
	var matrices = [];
	var counter = 0;

	app.filter('range', function() {
	  return function(input, total) {
	    total = parseInt(total);
	    for (var i=0; i<total; i++)
	      input.push(i);
	    return input;
	  };
	});

	app.controller('DisplayController', function(){
	    this.matrices = matrices;
	});

    app.controller("MatricesController", function() {
    	this.matrix = {};

		this.addMatrix = function() {
			this.matrix.id = counter;
			matrices.push(this.matrix);
			this.matrix = {};
			counter++;
		};
    });
})(); 