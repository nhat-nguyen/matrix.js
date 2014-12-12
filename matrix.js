/**
 * Created by hoangnhat on 2014-08-12.
 */

// returns a random integer between min and (excluded) max

function randint(min, max) {
 	return Math.floor(Math.random() * (max - min)) + min;
 }

// creates a matrix object that has a 2d array
// for values and information of its dimension

function createMatrix(m, n) {
    if (m <= 0 || n <= 0) return 0;

    var matrix = { value: new Array(m), row: m, col: n }, i, j;
    for (i = 0; i < m; i++) {
        matrix.value[i]= new Array(n)
        for (j = 0; j < n; j++)
            matrix.value[i][j] = 0;
    }

    return matrix;
}

// remove row #m and column #n from a matrix

function sliceMatrix(a, m, n) {
	var c = createMatrix(a.row - 1, a.col - 1), k, l, i = 0, j = 0;

	for (k = 0; k < a.row; k++) {
		for (l = 0; l < a.col; l++)
			if (k != m && l != n)
				c.value[i][j++] = a.value[k][l];
		j = 0; if (k != m) i++;
	}
	return c;
}

// returns a duplicate of the input matrix

function duplicateMatrix(a) {
	var i, j, c = createMatrix(a.row, a.col);

	for (i = 0; i < a.row; i++)
		for (j = 0; j < a.col; j++)
			c.value[i][j] = a.value[i][j];

	return c;
}

// replace the column #j of a with b

function replaceColumn(a, j, b) {
	var i, c = duplicateMatrix(a);

	for (i = 0; i < a.row; i++)
		c.value[i][j] = b.value[i][0];

	return c;
}

// add a row 
function expandColumn(a) {

}

function expandRow(a) {

}


function addMatrix(a, b) {
    if (a.row != b.row || a.col != b.col)
    	return;

    var c = createMatrix(a.row, a.col), i, j;

    for (i = 0; i < a.row; i++)
        for (j = 0; j < a.col; j++)
            c.value[i][j] = a.value[i][j] + b.value[i][j];
    return c;
}

function subtractMatrix(a, b) {
    if (a.row != b.row || a.col != b.col)
    	return;

    var c = createMatrix(a.row, a.col), i, j;

    for (i = 0; i < a.row; i++)
        for (j = 0; j < a.col; j++)
            c.value[i][j] = a.value[i][j] - b.value[i][j];
    return c;
}

function multiplyMatrix(a, b) {
    if (a.col != b.row) return;

	var c = createMatrix(a.row, b.col), i, j, k;

	for (i = 0; i < a.row; i++) {
		for (k = 0; k < b.col; k++) {
			for (j = 0; j < a.col; j++)
				c.value[i][k] += a.value[i][j] * b.value[j][k];
		}
	}
	return c;
}

// reduces a matrix to its REF form
// uses Gauss elimination method
// modifies a in-place

function reduceREF(a) {
	var i, j, stop = Math.min(a.row, a.col);
	var k, l, n, x, y, count = 0;
	for (j = 0; j < stop; j++) {
		for (i = 0; i == 0 && i < a.row; i++);
		if (i > j) {
			swapRow(a, i, j);
		}
		for (i = j + 1; i < a.row; i++) {
			count = 0;
			n = a.value[i][j] / a.value[j][j]; console.log(n);
			while (count < n) {
				for (x = 0; x < a.row; x++)
					a.value[i][x] -= a.value[j][x];
				count++;
			}
		}
	}
}

// swap row #m and row #n of the matrix

function swapRow(a, m, n) {
	var i, temp;
	if (m - n) {
		console.log("Swap row", m, n);
		for (i = 0; i < a.col; i++) {
			temp = a.value[m][i];
			a.value[m][i] = a.value[n][i];
			a.value[n][i] = temp;
		}
	}
}

function transpose(a) {
	var i, j, c = createMatrix(a.col, a.row);

	for (i = 0; i < a.row; i++)
		for (j = 0; j < a.col; j++)
            c.value[j][i] = a.value[i][j];
	return c;
}

function determinant(a) {
	var c = duplicateMatrix(a);
	reduceREF(c);

	var i = 0, j = 0, det = 1;
	while (i < c.row)
		det *= c.value[i++][j++];
	// console.log(det);
	return det;
}

// uses Laplace expansion
// expands the matrix in a random row or column

function determinantLaplace(a) {
	// if (a.row != a.col) return; // input must be a square matrix

	if (a.row == 2 && a.col == 2)
		return a.value[0][0] * a.value[1][1] - a.value[0][1] * a.value[1][0];

	var row = randint(0 ,2), i = randint(0, a.row), j, det = 0;

	// recursively compute determinant of the minors
	for (j = 0; j < a.col; j++) {
		det += Math.pow(-1, i + j) * a.value[i][j] * determinantLaplace(sliceMatrix(a, i, j));
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

	var c = cofactorMatrix(a), i, j = randint(0, a.col), detA = 0;

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
		// console.log("Matrix is not invertible.");
		return;
	}
}

// solves a system of linear equation using Cramer's Rule
// if det(A) == 0 then the system either has infinitely
// many solutions or no solutions at all
// [a | b] is the augmented matrix

function cramerRule(a, b) {
	var i, j, c, x = Array(a.col), detA = determinant(a);

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