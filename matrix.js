/**
 * Created by hoangnhat on 2014-08-12.
 */

// returns a random integer between min and (excluded) max
 function randint(min, max) {
 	return Math.floor(Math.random() * (max - min)) + min;
 }

function createMatrix(m, n) {
    if (m <= 0 || n <= 0) return 0;
    // a matrix object that has one 2d array for values
    // and information of its dimension
    var matrix = { value: new Array(m), row: m, col: n }, i, j;
    for (i = 0; i < m; i++) {
        matrix.value[i]= new Array(n)
        for (j = 0; j < n; j++)
            matrix.value[i][j] = 0;
    }
    return matrix;
}

function addMatrix(a, b) {
    if (a.row != b.row || a.col != b.col)
    	return 0;

    var c = createMatrix(a.row, a.col), i, j;
    for (i = 0; i < a.row; i++)
        for (j = 0; j < a.col; j++)
            c.value[i][j] = a.value[i][j] + b.value[i][j];
    return c;
}

function subtractMatrix(a, b) {
    if (a.row != b.row || a.col != b.col)
    	return 0;

    var c = createMatrix(a.row, a.col), i, j;
    for (i = 0; i < a.row; i++)
        for (j = 0; j < a.col; j++)
            c.value[i][j] = a.value[i][j] - b.value[i][j];
    return c;
}

function multiplyMatrix(a, b) {
    if (a.col != b.row)
		return 0;
	var c = createMatrix(a.row, b.col), i, j, k;
	for (i = 0; i < a.row; i++) {
		for (k = 0; k < b.col; k++) {
			for (j = 0; j < a.col; j++)
				c.value[i][k] += a.value[i][j] * b.value[j][k];
		}
	}
	return c;
}

// remove row #m, column #n from a matrix
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

// cofactor expansion
function cofactorExpansion(a, i, j) {
	
}

// using Laplace expansion
// expand the matrix in a random row or column
function determinant(a) {
	if (a.row != a.col) return; // input must be a square matrix
	if (a.row == 2 && a.col == 2)
		return a.value[0][0] * a.value[1][1] - a.value[0][1] * a.value[1][0];
	// i for row, j for column
	var row = randint(0 ,2), i = 0, j = 0, det = 0;
	if (row) i = randint(0, a.row); else j = randint(0, a.col);
	
	for (j = 0; j < a.col; j++) // recursively compute determinant of the minors
		det += Math.pow(-1, i + j) * a.value[i][j] * determinant(sliceMatrix(a, i, j));
	return det;
}

function transpose(a) {
	var i, j, c = createMatrix(a.col, a.row);
	for (i = 0; i < a.row; i++)
		for (j = 0; j < a.col; j++)
            c.value[j][i] = a.value[i][j];
	return c;
}

function cofactorMatrix(a, b) {

}