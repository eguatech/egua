const RuntimeError = require("../errors.js").RuntimeError;

module.exports.nula = function(){
  var nula = null;
  return nula;
}
module.exports.radiano = function(angle) {
  if (isNaN(angle) || angle === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.radiano(Ângulo)."
    );

  return angle * (Math.PI / 180);
};

module.exports.graus = function(angle) {
  if (isNaN(angle) || angle === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.graus(ângulo)."
    );

  return angle * (180 / Math.PI);
};

module.exports.pi = Math.PI; 

module.exports.raiz = function(num, root) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Número dado a mat.raiz(numero, raiz) precisa ser um número."
    );

  if (isNaN(root) || root === null)
    throw new RuntimeError(
      this.token,
      "Raiz dada a mat.raiz(numero, raiz) precisa ser um número."
    );

  let originalRoot = root;

  let negateFlag = root % 2 == 1 && num < 0;
  if (negateFlag) num = -num;
  let possible = Math.pow(num, 1 / root);
  root = Math.pow(possible, root);
  if (Math.abs(num - root) < 1 && num > 0 == root > 0)
    return negateFlag ? -possible : possible;

  else throw new RuntimeError(this.token, `Erro ao encontrar a raiz ${ originalRoot } de ${ num }.`)
};


module.exports.nula = function() {
  var nula = null;
  return nula;
};

//FUNÇÃO AFIM E QUADRÁTICA
//Valores das Abscissas
module.exports.fun1 = function(a,b) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para fun1(valor1,valor2)."
    );
  x = [b-4,b-3,b-2,b-1,b,b+1,b+2,b+3,b+4];
  f = x.map(function(x) { return ((x * a)+b); });
  return ['f(x)= '+f];
};

//Raíz da Função Afim
module.exports.fun1R = function(a,b) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para fun1(valor1,valor2)."
    );
  x = (-1*b)/a;
  return ['f(0)= '+x];
};

//Intervalo Preenchido
module.exports.linspace = function(startValue, stopValue, cardinality) {
  if (isNaN(startValue) || startValue === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para linspace(valor1,valor2,valor3)."
    );
  var lista = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return lista;
};

//Gráfico da Função Quadrática
module.exports.fun2 = function(a,b,c) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para fun2(a,b,c)."
    );
  n = 2.5;
  var arr = [];
  var step = (n - (-n)) / (n- 1);
  for (var i = 0; i < n; i=i+0.01) {
    arr.push(((-n-1.945) + (step * i)));
  }
  x = arr;
  f = x.map(function(x) { return ((x * x * a)+(b * x)+c); });
  plot(x,f);//['f(x) ='+f];
};

//Raízes da Função Quadrática
module.exports.fun2R = function(a,b,c) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para fun2R(a,b,c)."
    );
  r1 = (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
  r2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
  xv = (-1*b)/(2*a);
  yv = (-1*(Math.pow(b, 2) - (4 * a * c)))/4*a;
  return ["Xv: " + xv + " Yv: " + yv];
};

//Matriz aleatória bidimensional
module.exports.rand = function(n1,n2,e) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para rand(n1,n2,e)."
    );
  if (e == undefined) { e = 0; }
  if (n1 == undefined && n2 == undefined) { return Math.random() * 2 - 1; }
  var data = Array.from(Array(n1),() => new Array(n2));
  // benefit from creating array this way is a.length = number of rows and a[0].length = number of columns
  for (var i = 0; i < n1; i++) {
    for (var j = 0; j < n2; j++) {
      data[i][j] = e + Math.random() * 2 - 1;
    }
  }
  return aprox(data,5);
};

//Aproximação de valores
module.exports.aprox = function(x,z) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para aprox(x,z)."
    );
  if (z == undefined) { z = 2; }
  console.log("type of = " + typeof (x));
  if (typeof (x) == "number") { x = x.toFixed(z) }
  else if (x[0].length == undefined) { // 1D array
    for (var i = 0; i < x.length; i++) {
      x[i] = parseFloat(x[i].toFixed(z));
    }
  } else
    for (var i = 0; i < x.length; i++) { // 2D array
      for (var j = 0; j < x[0].length; j++) {
        x[i][j] = parseFloat(x[i][j].toFixed(z));
      }
    }
  return x; //OK
};

//Parâmetros da Função
module.exports.matrizn = function(z) {
  if (isNaN(z) || z === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para matrizn(z)."
    );
  n = arguments.length;
  console.log("n = " + n);
  var data = Array.from(Array(1),() => new Array(n));
  for (var i = 0; i < n; i++) { data[0][i] = arguments[i];}
  return matriz(data);
};

//Vetor de pontos aleatórios
module.exports.pale = function(n) {
  if (isNaN(n) || n === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para pale(n)."
    );
  if (ex == undefined) { ex = 0; }
  var x = [];
  x[0] = 100;
  for (var i = 1; i < n; i++) {
    x[i] = ex + x[i - 1] + Math.random() * 2 - 1;
  }
  var xx = aprox(x, 2);
  console.log(xx);
  return xx;
};

//Intervalo A-B
module.exports.vet = function(a,b) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para vet(a,b)."
    );
  var data = Array.from(Array(1),() => new Array(b-a+1));
  // the benefit from creating array this way is a.length = number of rows and a[0].length = number of columns
  for (var i = 0; i < data[0].length; i++) {
    data[0][i]= a + i;
  }
  return matrizn(data);
};

//Contagem de Elementos
module.exports.qtd = function(a,b) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para qtd(a,b)."
    );
  if (b == undefined) {
    var count = a.length;
  } else {
    var count = 0;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] == b)
        count++;
    }
  }
  return count;
};

//Gráfico do Vetor
module.exports.plot = function(x,y) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para plot(z)."
    );

  var yy = y;
  var xx = x;

  var data = [{
    x: xx,
    y: yy,
    type: 'scatter',
    line: { color: 'blue', width: 2 }
  }];
  var layout =
      {
        width: window.screen.Width,
        height: 550,
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        margin: { l: 70, b: 60, r: 10, t: 40 },
        xaxis: { title: 'x-axis', titlefont: { family: 'Courier New, monospace', size: 18, color: 'black' } },
        yaxis: { title: 'y-axis', titlefont: { family: 'Courier New, monospace', size: 18, color: 'black' } },
        xaxis: { tickfont: { size: 12, color: 'black' }, showgrid: true, gridcolor: 'black', linecolor: 'black' },
        yaxis: { tickfont: { size: 12, color: 'black' }, showgrid: true, gridcolor: 'black', linecolor: 'black' }
      };
  toggleOrCheckIfFunctionCall(true);
  Plotly.newPlot(outId, data, layout, { displayModeBar: true, staticPlot: true });
};

/*ESTATÍSTICA*/
//Valor Máximo de uma matriz
module.exports.max = function(a) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para max(a)."
    );

  return Math.max.apply(null, a);
};

//Valor Mínimo de uma matriz
module.exports.min = function(a) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para min(a)."
    );

  return Math.min.apply(null, a);
};

//Intervalo (max - min) de uma matriz
module.exports.intervalo = function(a) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para intervalo(a)."
    );

  return max(a) - min(a);
};

//Mediana de uma matriz
module.exports.mediana = function(a) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para mediana(a)."
    );

  a.sort(function (a, b) { return a - b; });
  var mid = a.length / 2;
  return mid % 1 ? a[mid - 0.5] : (a[mid - 1] + a[mid]) / 2;
};

//Soma de determinada matriz
module.exports.smtr = function(a) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para smtr(a)."
    );

  var z = 0 ;
  if (a.length == 1) {   // a is a 1D row array
    for (var j = 0; j < a[0].length; j++) {z = z + a[0][j]; }
  }
  else if (a[0].length == 1) {   // a is a 1D column array
    console.log("column array");
    for (var i = 0; i < a.length; i++) {z = z + a[i][0]; }
  }
  else {
    for (var j = 0; j < a.length; j++) {z = z + a[j]; }
  }
  toggleOrCheckIfFunctionCall(false);
  return aprox(z,2);
};

//Média de uma matriz
module.exports.media = function(a) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para media(a)."
    );

  return smtr(a)/a.length;
};

//Média aritmética de uma matriz
module.exports.ve = function(a) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para ve(a)."
    );

  if(a.length == 1){return aprox(smtr(a) / a[0].length,4);} // a is a row array
  if(a[0].length == 1){return aprox(smtr(a) / a.length,4);} // a is a column array
  if(a[0].length == undefined){return aprox(smtr(a) / a.length,4);}
};

//Soma dos quadrados dos resíduos (sqr) de uma matriz
module.exports.sqr = function(a) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para sqr(a)."
    );
  var mean = ve(array);
  var sum = 0;
  var i = array.length;
  var tmp;
  while (--i >= 0) {
    tmp = array[i] - mean;
    sum += tmp * tmp;
  }
  return sum;
};

//Variação de uma matriz
module.exports.variancia = function(array, flag) {
  if (isNaN(array) || array === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para variancia(matriz, flag)."
    );
  if (flag == undefined) { flag = 1; }
  return sqr(array) / (array.length - (flag ? 1 : 0));
};

//Desvio padrão de uma matriz
module.exports.devpad = function(matriz, flag) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para devpad(matriz, flag)."
    );

  if (flag == undefined) { flag = 1; }
  return aprox(Math.sqrt(variancia(array, flag)));
};

//Covariância de duas matrizes
module.exports.covar = function(array1, array2) {
  if (isNaN(array1) || array1 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para covar(matriz1, matriz2)."
    );
  var u = ve(array1);
  var v = ve(array2);
  var arr1Len = array1.length;
  var sq_dev = new Array(arr1Len);
  for (var i = 0; i < arr1Len; i++)
    sq_dev[i] = (array1[i] - u) * (array2[i] - v);
  return smtr(sq_dev) / (arr1Len - 1);
};

//Coeficiente de variação para uma matriz
module.exports.coefvar = function(array) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para coefvar(matriz)."
    );

  return devpad(array, 1) / ex(array);
};

//Coeficiente de correlação de pearson para duas matrizes
module.exports.coefcorr = function(array1, array2) {
  if (isNaN(array1) || array1 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para coefcorr(array1, array2)."
    );

  return aprox(covar(array1, array2) / devpad(array1, 1) / devpad(array2, 1));
};

/*MATRIZES*/
//Coluna específica c de uma matriz bidimensional
module.exports.coluna = function(a,c) {
  if (isNaN(a) || c === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para coluna(a,c)."
    );

  var column = Array.from(Array(a.length), () => new Array(1));
  for (var i = 0; i < a.length; i++) {
    column[i][0] = a[i][c - 1];
  }
  return matriz(column);
};

//Linha específica c de uma matriz bidimensional
module.exports.linha = function(a,r) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para linha(a,r)."
    );

  console.log(a[0].length);
  var row = [];
  for (var j = 0; j < a[0].length; j++) {
    row.push(a[r - 1][j]);
  }
  return matriz(row);
};

//Transposta de linhas de um vetor
module.exports.transposta = function(a) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para transposta(a)."
    );
  console.log("a.length = " + a.length);
  console.log("a[0].length = " + a[0].length);

  if (a[0].length == undefined) { // a is a 1D row array
    var data = Array.from(Array(a.length), () => new Array(1));
    for (var j = 0; j < a.length; j++) {
      data[j][0] = a[j];
    }
  } else if (a[0].length == 1) { // a is a 1D column array
    var data = [];
    for (var i = 0; i < a.length; i++) {
      data[i] = a[i][0];
    }
  } else { // a is a 2D array
    var data = [];
    for (var j = 0; j < a[0].length; j++) {
      data[j] = Array(a.length);
    }
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < a[0].length; j++) {
        data[j][i] = a[i][j];
      }
    }
  }
  return matriz(data);
};

//Criação e exibição de tabelas de um vetor ou matriz
module.exports.matriz = function(z) {
  if (isNaN(z) || z === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para matriz(a)."
    );

  if (z[0].length == undefined) { // 1D array
    var table = document.createElement('table');
    table.setAttribute("class", "matrix");
    var tableBody = document.createElement('tbody');
    var row = document.createElement("tr");
    tableBody.appendChild(row);
    for (var i = 0; i < z.length; i++) {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(z[i]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    table.appendChild(tableBody);
  } else { // 2D array
    var table = document.createElement('table');
    table.setAttribute("class", "matrix");
    var tableBody = document.createElement('tbody');
    z.forEach(function (rowData) {
      var row = document.createElement('tr');
      rowData.forEach(function (cellData) {
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
  }
  document.getElementById(outId).innerHTML = table.outerHTML;
  toggleOrCheckIfFunctionCall(true);
  console.log(z);
  return z;
};

//Multiplicação de matrizes
module.exports.matrizmult = function(a,b) {
  if (isNaN(a) || a === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para matrizmult(a,b)."
    );

  var data = [];  // maybe change this to array of array
  console.log("a.length = " + a.length);
  console.log("a[0].length = " + a[0].length);
  console.log("b.length = " + b.length);
  console.log("b[0].length = " + b[0].length);

  // if a is a 1D row array and b is a 1D column array
  if (a.length == 1 && b[0].length == 1) {
    for (var i = 0; i < a[0].length; i++) { data[i] = a[0][i] * b[i][0]; }
  }
  // if a is a 1D column array and b is a 1D row array
  else if (a[0].length == 1 && b.length == 1) {
    for (var i = 0; i < a.length; i++) { data[i] = a[i][0] * b[0][i]; }
  }
  // if a is a 1D column array and b is a 1D column array
  else if (a[0].length == 1 && b[0].length == 1) {
    for (var i = 0; i < a.length; i++) { data[i] = a[i][0] * b[i][0]; }
  }
  // if a is a 1D row array and b is a 1D row array
  else if (a.length == 1 && b.length == 1) {
    for (var i = 0; i < a[0].length; i++) { data[i] = a[0][i] * b[0][i]; }
  }
  // if a is a 2D array and b is a 2D array
  else {
    for (var r = 0; r < a.length; ++r) {
      data[r] = new Array(b[0].length); // initialize the current row
      for (var c = 0; c < b[0].length; ++c) {
        data[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < a[0].length; ++i) {
          data[r][c] += a[r][i] * b[i][c];
        }
      }
    }
  }
  return matriz(aprox(data));
};

//Inverso de uma matriz
module.exports.matrizinv= function(m) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para matrizinv(m)."
    );

  if (m.length !== m[0].length) { return "não é uma matriz quadrada"; }

  //create the identity matrix (I), and a copy (C) of the original
  var i = 0, ii = 0, j = 0, dim = m.length, e = 0, t = 0;
  var I = [], C = [];
  for (i = 0; i < dim; i += 1) {
    // Create the row
    I[I.length] = [];
    C[C.length] = [];
    for (j = 0; j < dim; j += 1) {

      //if we're on the diagonal, put a 1 (for identity)
      if (i == j) { I[i][j] = 1; }
      else { I[i][j] = 0; }

      // Also, make the copy of the original
      C[i][j] = m[i][j];
    }
  }

  // Perform elementary row operations
  for (i = 0; i < dim; i += 1) {
    // get the element e on the diagonal
    e = C[i][i];

    // if we have a 0 on the diagonal (we'll need to swap with a lower row)
    if (e == 0) {
      //look through every row below the i'th row
      for (ii = i + 1; ii < dim; ii += 1) {
        //if the ii'th row has a non-0 in the i'th col
        if (C[ii][i] != 0) {
          //it would make the diagonal have a non-0 so swap it
          for (j = 0; j < dim; j++) {
            e = C[i][j];       //temp store i'th row
            C[i][j] = C[ii][j];//replace i'th row by ii'th
            C[ii][j] = e;      //repace ii'th by temp
            e = I[i][j];       //temp store i'th row
            I[i][j] = I[ii][j];//replace i'th row by ii'th
            I[ii][j] = e;      //repace ii'th by temp
          }
          //don't bother checking other rows since we've swapped
          break;
        }
      }
      //get the new diagonal
      e = C[i][i];
      //if it's still 0, not invertable (error)
      if (e == 0) { return }
    }

    // Scale this row down by e (so we have a 1 on the diagonal)
    for (j = 0; j < dim; j++) {
      C[i][j] = C[i][j] / e; //apply to original matrix
      I[i][j] = I[i][j] / e; //apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL of
    // the other rows so that there will be 0's in this column in the
    // rows above and below this one
    for (ii = 0; ii < dim; ii++) {
      // Only apply to other rows (we want a 1 on the diagonal)
      if (ii == i) { continue; }

      // We want to change this element to 0
      e = C[ii][i];

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (which it should be if we made this
      // algorithm correctly)
      for (j = 0; j < dim; j++) {
        C[ii][j] -= e * C[i][j]; //apply to original matrix
        I[ii][j] -= e * I[i][j]; //apply to identity
      }
    }
  }
  console.log(I);  // C should be the identity and matrix I should be the inverse:
  return matriz(aprox(I, 2));
};

//Matriz de identidade
module.exports.matrizid= function(m) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para matrizid(m)."
    );
  var data = Array.from(Array(n), () => new Array(n));
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (i === j) { data[i][j] = 1; }
      else { data[i][j] = 0; }
    }
  }
  return matriz(data);
};

/*TRIGONOMETRIA*/
//Seno de um número
module.exports.sen = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para sen(x)."
    );

  return Math.sin(x);
};

//Cosseno de um número
module.exports.cos = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para cos(x)."
    );

  return Math.cos(x);
};

//Tangente de um número
module.exports.tan = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para tan(x)."
    );

  return Math.tan(x);
};

//Arco cosseno de um número
module.exports.arcos = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para arcos(x)."
    );

  return Math.acos(x);
};

//Arco seno de um número
module.exports.arsen = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para arsen(x)."
    );

  return Math.asin(x);
};

//Arco tangente de um número
module.exports.artan = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para artan(x)."
    );

  return Math.atan(x)
};

//Exponencial
module.exports.exp = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para exp(x)."
    );

  return Math.exp(x);
};

//Logaritmo natural
module.exports.log = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para log(x)."
    );

  return Math.log(x);
};

//Potenciação de um número base X por uma expoente Y
module.exports.pot = function(x,y) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para pot(x,y)."
    );

  return Math.pow(x,y);
};

//Número pseudo-aleatório
module.exports.aleat = function() {
  return Math.random();
};

//Raíz quadrada
module.exports.raizq = function(x) {
  if (isNaN(x) || x === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para raizq(x)."
    );

  return Math.sqrt(x);
};

/*CINEMÁTICA*/

//Velocidade média
module.exports.vmed = function(s,t) {
  if (isNaN(s) || s === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para vmed(d,t)."
    );

  return (s/t);
};

//Espaço percorrido
module.exports.deltas = function(s0,s) {
  if (isNaN(s0) || s0 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para deltas(e0,e1)."
    );
  ds = s-s0;
  return ds;
};

//Tempo Percorrido
module.exports.deltat = function(t0,t) {
  if (isNaN(t0) || t0 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para deltat(t0,t1)."
    );
  dt=t-t;
  return dt;
};

//Aceleração
module.exports.acel = function(v, v0, t, t0) {
  if (isNaN(v) || v === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para acel(v, v0, t, t0)."
    );
  a = (v-v0)/(t-t0)
  return a;
};

//Função Horária da Posição (M.R.U)
module.exports.mrufh = function(s0,v,t) {
  if (isNaN(s0) || s0 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para mrufh(s0,v,t)."
    );
  t=t+1;
  var s = new Array();
  var index = 0;
  for(var i=0;i<t;i++){
    s[index]=s0+v*i;
    index++;
    console.log(s[i]);
  }
  return ["Função: "+s0+"+("+v+")*t"+"<br>"+"Posições: "+s];
};

//Gráfico para a Função Horária da Posição (M.R.U)
module.exports.mrufhp = function(s0,v, t) {
  if (isNaN(s0 || s0 === null))
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para mrufhp(Pi, Vf, T)."
    );
  var s = new Array();
  var x = new Array();
  var index = 0;
  for(var i=0;i<t;i++){
    s[index]=s0+v*i;
    x[index] = i;
    index++;
    console.log(s[i]);
  }
  return plot(x,s);
};

//Gráfico Velocidade (M.R.U)
module.exports.mruvel = function(s0,s,t) {
  if (isNaN(s0) || s0 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para mruvel(s0,s,t)."
    );
  var v = new Array();
  var x = new Array();
  var index = 0;
  for(var i=0;i<t;i++){
    v[index]=(s-s0)/t;
    x[index]=i;
    index++;
    console.log(v[i]);
  }
  return plot(x,v);
};

//Função Horária da Posição (M.R.U.V)
module.exports.mruvfh = function(s0,v0, t, a) {
  if (isNaN(s0) || s0 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para mruvfh(s0,v0, t, a)."
    );

  var index = 0;
  var s = new Array(t);
  for(var i=0;i<t;i++){
    s[index]=s0+v0*i+((a*i*i)/2);
    index++;
    console.log(s[i]);
  }
  return s;
};

//Gráfico para a Função Horária da Posição (M.R.U.V)
module.exports.mruvfhp = function(s0,v0, t, a) {
  if (isNaN(s0) || s0 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para mruvfhp(Pi, Vf, T, A)."
    );

  var index = 0;
  var s = new Array(t);
  var x = new Array();
  for(var i=0;i<t;i++){
    s[i]=s0+v0*i+((a*i*i)/2);
    x[index] = i;
    index++;
    console.log(s[i]);
  }
  return plot(x,s);
};

//Gráfico da velocidade (M.R.U.V)
module.exports.mruvvel = function(s0,s,a) {
  if (isNaN(s0) || s0 === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para mruvvel(Pi, Vf, A)."
    );
  var vf = new Array();
  var x = new Array();
  var v = new Array();
  var index = 0;
  for(var i=0;i<s;i++){
    v=index;
    vf[index]=Math.sqrt(2*a*(index-s0));
    x[index]=i;
    index++;
    console.log(vf[i]);
  }
  return vf;
};

/*Controle e Servomecanismos*/
module.exports.pid = function(Mo, t, K, T1, T2) {
  if (isNaN(Mo) || Mo === null)
    throw new RuntimeError(
        this.token,
        "Você deve prover valores para pid(Ov, Ts, K, T1, T2)."
    );
  pi = Math.PI;//Pi da bilbioteca Math.js

  //Amortecimento Relativo
  csi = (-1*(Math.log((Mo/100))))/(Math.sqrt(Math.pow(pi,2)+(pot((Math.log((Mo/100))),2))));

  //Frequência Natural
  Wn = (4)/(t*csi);

  //Controlador Proporcional (P)
  Kp = 20*(Math.pow(csi,2)*Math.pow(Wn,2)*T1*T2)+((Math.pow(Wn,2)*T1*T2)-1)/(K);

  //Controlador Integral (I)
  Ki = (10*csi*(Math.pow(Wn,3))*T1*T2)/(K);

  //Controlador Derivativo (D)
  Kd = (12*csi*Wn*T1*T2-T1-T2)/(K);
  return ['csi:'+csi,'<br/>','Wn:'+Wn,'<br/>','Proporcional:'+Kp,'<br/>','Integral:'+Ki,'<br/>','Progressivo:'+Kd];
};

//Comprimento de um vetor
module.exports.comp= function(a) {

  var comp = a.length;
  return comp;
};

// Retorna o menor número inteiro dentre o valor de "value"
module.exports.minaprox = function(value) {

  if (typeof value === 'string' || typeof value === 'number'){
    return Math.floor(value);
  }
  
  throw new RuntimeError(
    this.token,
    "O valor passado pra função deve ser uma string ou um número."
  );
};