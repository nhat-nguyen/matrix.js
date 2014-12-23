(function() {
	var app = angular.module('matrixCalc', []);
	var matrices = [], operations = [];
	var counter = 0, counter_result = 0;

	app.filter('range', function() {
	  return function(input, total) {
	    total = parseInt(total);
	    for (var i=0; i<total; i++)
	      input.push(i);
	    return input;
	  };
	});

	app.controller('DisplayController', function(){
	    this.operations = operations;
	});

    app.controller("MatricesController", function() {
    	this.matrices = matrices;
    	this.results = [];

		this.newMatrix = function() {
			this.matrix.id = counter;
			this.matrix.det = createFraction();
			this.matrix.showDet = 0;
			matrices.push(this.matrix);
			this.matrix = {};
			counter++;
		};

		this.convertFraction = function(matrix) {
			var i, j;
			// add a matrix attribute to the current input
			matrix.value = Array(matrix.row);
			for (i = 0; i < matrix.row; i++)
				matrix.value[i] = Array(matrix.col);

			for (i = 0; i < matrix.row; i++)
				for (j = 0; j < matrix.col; j++) {
					matrix.value[i][j] = readFraction(matrix.temp[i][j]);
				}
		};

		this.compute = function() {
			var i, temp, switchCount, a, b;
			if (this.matrices.length > 1) {
				temp = this.matrices[0];
				this.convertFraction(temp);
				for (i = 1; i < this.matrices.length; i++) {

					this.convertFraction(this.matrices[i]);

					if (this.matrices[i].operation == '+')
						temp = addMatrix(temp, this.matrices[i]);
					else if (this.matrices[i].operation == '-')
						temp = subtractMatrix(temp, this.matrices[i]);
					else if (this.matrices[i].operation == '*')
						temp = multiplyMatrix(temp, this.matrices[i]);
				}
			} else {
				this.convertFraction(this.matrices[0]);
				temp = duplicateMatrix(this.matrices[0]);
				simplifyRREF(temp);
			}
			temp.id = counter_result++;
			this.results.push(temp);
		};

		this.deleteMatrix = function(matrix) {
			var i;
			for (i = matrix.id + 1; i < this.matrices.length; i++) {
				this.matrices[i].id --;
			}
			this.matrices.splice(matrix.id, 1);
			for (i = matrix.id; i == matrix.id && i < this.results.length; i++) {
				if (this.results[i].id == matrix.id)
					this.results.splice(i, 1);
			}
			console.log(this.results)
			counter--;
		};

		this.deleteResult = function(matrix) {
			var i;
			for (i = matrix.id + 1; i < this.matrices.length; i++) {
				this.results[i].id --;
			}
			this.results.splice(matrix.id, 1);
		};

		this.calcDet = function(matrix) {
			this.convertFraction(matrix);
			var temp = duplicateMatrix(matrix),
				result = determinant(temp);
			temp.det = duplicateFraction(result);
			temp.showDet = 1;
			this.results.push(temp);
		};
    });
})();

// returns a random integer between min and (excluded) max

function randint(min, max) {
 	return Math.floor(Math.random() * (max - min)) + min;
}

function gcd(a, b) {
	a = Math.abs(a); b = Math.abs(b);
	var temp;
	while (a > 0) {
		temp = a; a = b % a; b = temp;
	}
	return b;
}

// creates a fraction object, default value is 0/1

function createFraction() {
	var f = { a: 0, b: 1 };
	return f;
}

// reads in a string with a fraction form
// returns a fraction object

function readFraction (str) {
	var f = createFraction();
	str = String(str);
	str = str.replace(/\s/g, "").split("/");
	if (str.length == 1) {
		f.a = Number(str[0]);
		f.b = 1;
	} else {
		f.a = Number(str[0]);
		f.b = Number(str[1]);
	}
	return f;
}

function duplicateFraction (f) {
	var f1 = createFraction();
	f1.a = f.a; f1.b = f.b;
	return f1;
}

function simplifyFraction(f) {
	var n = gcd(f.a, f.b);
	f.a /= n; f.b /= n;
	if (f.b < 0) {
		f.a = - f.a; f.b = - f.b;
	}
	return f;
}

function addFraction(f1, f2) {
	var GCD = gcd(f1.b, f2.b),
		f3 = createFraction(),
		n1 = f2.b / GCD, n2 = f1.b / GCD;
	f3.a = n1 * f1.a + n2 * f2.a;
	f3.b = n1 * f1.b;
	return simplifyFraction(f3);
}

function subtractFraction(f1, f2) {
	f2.a = - f2.a;
	return addFraction(f1, f2);
}

// multiplies 2 fractions

function multiplyFraction(f1, f2) {
	var f3 = createFraction();
	f3.a = f1.a * f2.a;
	f3.b = f1.b * f2.b;
	return simplifyFraction(f3);
}

function divideFraction(f1, f2) {
	var f3 = createFraction();
	f3.a = f1.a * f2.b;
	f3.b = f1.b * f2.a;
	return simplifyFraction(f3);
}

// creates a matrix object that has a 2d array
// for values and information of its dimension

function createMatrix(m, n) {
    if (m <= 0 || n <= 0) return;

    var matrix = { value: new Array(m), row: m, col: n }, i, j;
    for (i = 0; i < m; i++) {
        matrix.value[i]= new Array(n)
        for (j = 0; j < n; j++)
            matrix.value[i][j] = createFraction();
    }
    return matrix;
}

// removes row #m and column #n from a matrix

function sliceMatrix(a, m, n) {
	var c = createMatrix(a.row - 1, a.col - 1),
		k, l, i = 0, j = 0;

	for (k = 0; k < a.row; k++) {
		for (l = 0; l < a.col; l++)
			if (k != m && l != n) {
				c.value[i][j++] = duplicateFraction(a.value[k][l]);
			}
		j = 0; if (k != m) i++;
	}
	return c;
}

// returns a duplicate of the input matrix

function duplicateMatrix(a) {
	var i, j, c = createMatrix(a.row, a.col);

	for (i = 0; i < a.row; i++)
		for (j = 0; j < a.col; j++)
			c.value[i][j] = duplicateFraction(a.value[i][j]);

	return c;
}

// replace the column #j of a with b

function replaceColumn(a, j, b) {
	var i, c = duplicateMatrix(a);

	for (i = 0; i < a.row; i++)
		c.value[i][j] = duplicateFraction(b.value[i][0]);

	return c;
}

function addMatrix(a, b) {
    if (a.row != b.row || a.col != b.col)
    	return;

    var c = createMatrix(a.row, a.col), i, j;

    for (i = 0; i < a.row; i++)
        for (j = 0; j < a.col; j++)
            c.value[i][j] = addFraction(a.value[i][j], b.value[i][j]);
    return c;
}

function subtractMatrix(a, b) {
    if (a.row != b.row || a.col != b.col)
    	return;

    var c = createMatrix(a.row, a.col), i, j;

    for (i = 0; i < a.row; i++)
        for (j = 0; j < a.col; j++)
            c.value[i][j] = subtractFraction(a.value[i][j], b.value[i][j]);
    return c;
}

function multiplyMatrix(a, b) {
    if (a.col != b.row) return;

	var c = createMatrix(a.row, b.col), i, j, k;

	for (i = 0; i < a.row; i++) {
		for (k = 0; k < b.col; k++) {
			for (j = 0; j < a.col; j++)
				c.value[i][k] = addFraction(c.value[i][k], multiplyFraction(a.value[i][j], b.value[j][k]));
		}
	}
	return c;
}

// swaps row #m and row #n of the matrix
// returns 1 if the switch operation is performed
// 0 otherwise

function swapRow(a, m, n) {
	var i, temp_a, temp_b;
	if (m != n) {
		for (i = 0; i < a.col; i++) {
			temp_a = a.value[m][i].a;
			temp_b = a.value[m][i].b;
			a.value[m][i].a = a.value[n][i].a;
			a.value[m][i].b = a.value[n][i].b;
			a.value[n][i].a = temp_a;
			a.value[n][i].b = temp_b;
		}
		return 1;
	}
	return 0;
}

// reduces a matrix to its REF form
// uses Gauss elimination method
// modifies A in-place
// no decimal numbers handling method is currently used
// so the result might be slightly off

function simplifyREF(a) {
	var row, col = 0, last_leading_row = 0,
		eliminated_row, eliminated_col, n,
		// the number of switch rows operations
		// used to determine the determinant later if needed
		switchCount = 0;
	while (last_leading_row < a.row && col < a.col) {
		for (row = last_leading_row; row < a.row; row++) {
			// makes sure this works properly with decimal
			if (a.value[row][col].a) {
				// swaps the row with leading non-zero entry to
				// the current row
				switchCount += swapRow(a, last_leading_row, row);
				// loops through all rows below
				// eliminates all leading entries
				for (eliminated_row = last_leading_row + 1; eliminated_row < a.row; eliminated_row++) {
					// the multiple of the current row's leading entry with respect to 
					// that of the last leading row
					n = divideFraction(a.value[eliminated_row][col] , a.value[last_leading_row][col]);
					for (eliminated_col = col; eliminated_col < a.col; eliminated_col++) {
						a.value[eliminated_row][eliminated_col] = 
						subtractFraction(a.value[eliminated_row][eliminated_col], multiplyFraction(a.value[last_leading_row][eliminated_col], n));
					}
				}
				last_leading_row++;
			}
		}
		col++;
	}
	return switchCount;
}

function simplifyRREF(a) {
	var m, n, i, j, k = 0, l, multiple;
	// reduces to REF first
	simplifyREF(a);
	for (m = 0; m < a.row; m++) {
		for (n = m + 1; n < a.row; n++) {
			for (i = 0; i < a.col && !(a.value[n][i].a); i++);
			if (i < a.col && a.value[m][i].a) {
				multiple = divideFraction(a.value[n][i], a.value[m][i]);
				for (j = 0; j < a.col; j++)
					a.value[m][j] = subtractFraction(multiplyFraction(a.value[m][j], multiple), a.value[n][j]);
			}
		}
		for (; k < a.col && !(a.value[m][k].a); k++);
		for (j = k + 1; j < a.col; j++)
			a.value[m][j] = divideFraction(a.value[m][j], a.value[m][k]);
		if (k < a.col) a.value[m][k].a = a.value[m][k].b = 1;
	}
}

// returns the rank of A
// reduces A to its REF form first

function rank(a) {
	simplifyREF(a);
	var i = 0, j = 0, r = 0;
	for (i = 0; i < a.row && j < a.col; i++) {
		for (; j < a.col && !(a.value[i][j].a); j++);
		if (j < a.col) r++;
	}
	return r;
}

function transpose(a) {
	var i, j, c = createMatrix(a.col, a.row);

	for (i = 0; i < a.row; i++)
		for (j = 0; j < a.col; j++)
            c.value[j][i] = duplicateFraction(a.value[i][j]);
	return c;
}

// computes using the REF method
// it reduces the matrix to the REF first
// then multiply all the diagonal entries together
// faster than the Laplace method

function determinant(a) {
	var n = simplifyREF(a),
		i = 0, j = 0, det = createFraction();
	det.a = 1;
	while (i < a.row)
		det = multiplyFraction(det, a.value[i++][j++]);

	if (n % 2 == 0) return det;
	else {
		det.a = -det.a
		return det;
	}
}

// uses Laplace expansion
// expands the matrix in a random row or column
// the complexity is O(n!)
// considerably slower than the REF method
// literally stuck when the matrix dimension is over 9x9

function determinantLaplace(a) {
	if (a.row != a.col) return; // input must be a square matrix

	if (a.row == 2 && a.col == 2)
		return a.value[0][0] * a.value[1][1] - 
				a.value[0][1] * a.value[1][0];

	var i = 0, j, det = 0, detA;

	// recursively compute determinant of the minors
	for (j = 0; j < a.col; j++) {
		if (a.value[i][j]) {
			detA = determinantLaplace(sliceMatrix(a, i, j));
			det += Math.pow(-1, i + j) * a.value[i][j] * detA;
		}
	}
	return det;
}

// cofactor matrix is a matrix where every value is
// the result ofthe cofactor expansion

function cofactorMatrix(a) {
	var c = createMatrix(a.row, a.col), i, j;
	for (i = 0; i < a.row; i++)
		for (j = 0; j < a.col; j++)
			c.value[i][j] = determinant(sliceMatrix(a, i, j)) * Math.pow(-1, i+j);

	return c;
}

// returns the inverse matrix of the input
// uses Laplace expansion method
// this requires a lot of processing power
// A^(-1) = 1/det(A) * Cof(A)^T

function inverseLaplace(a) {
	if (a.row != a.col) return; // input must be a square matrix

	var c = cofactorMatrix(a),
		i, j = randint(0, a.col), detA = 0;

	// computes the determinant using the cofactor matrix
	// this can avoid the recalculation of the determinant
	// since the determinant is in fact the sum of every entry
	// in a row/column of the cofactor matrix

	for (i = 0; i < a.row; i++)
		detA += c.value[i][j] * a.value[i][j];

	if (detA) {
		c = transpose(c);
		// console.log (1 / detA, c);
	} else {
		console.log("Matrix is not invertible.");
		return;
	}
}

// solves a system of linear equation using Cramer's Rule
// if det(A) == 0 then the system either has infinitely
// many solutions or no solutions at all
// [a | b] is the augmented matrix

function cramerRule(a, b) {
	var i, j, c, x = Array(a.col),
		detA = determinant(a);

	if (detA) {
		for (i = 0; i < a.col; i++) {
			c = replaceColumn(a, i, b);
			x[i] = determinant(c) / (detA);
		}
		for (i = 0; i < x.length; i++)
			console.log(x[i] + "\n");

		return x;
	} else console.log("Infinitely many solutions / No solutions.");
}

function printFraction(f) {
	console.log(f.a, " / ", f.b);
}