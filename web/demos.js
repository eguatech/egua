const Exemplos = '';

const OlaMundo = 'escreva("Olá, mundo!");';

const Classe = `classe Animal {
  correr() {
      escreva("Correndo Loucamente");
  }
}
classe Cachorro herda Animal {
  latir() {
      escreva("Au Au Au Au");
  }
}
var nomeDoCachorro = Cachorro();
nomeDoCachorro.correr();
nomeDoCachorro.latir();`

const MergeSort = `var vetor1 = [8, 2, 9, 5];
var a=0;
var aux=0;
var i=0;
escreva ("Vetor: Posição[0]:"+texto(vetor1[0]));
escreva ("Vetor: Posição[1]:"+texto(vetor1[1]));
escreva ("Vetor: Posição[2]:"+texto(vetor1[2]));
escreva ("Vetor: Posição[3]:"+texto(vetor1[3]));
para (i=0; i<3; i=i+1){
  se (vetor1[i]>vetor1[i+1]){
    
    escreva ("Vetor "+texto(i));
    aux = vetor1[i];
    vetor1[i] = vetor1[i+1];
    vetor1[i+1] = aux;
    escreva(vetor1[i]);
    escreva(vetor1[i+1]);
  }
}
var vetor2 = [vetor1[0], vetor1[1]];
var vetor3 = [vetor1[2], vetor1[3]];
var vetor4 = [];
para (a=0; a<4; a=a+1){
  escreva ("vetor1("+texto(a)+")");
  escreva (vetor1[a]);
}
para (a=0; a<2; a=a+1){
  escreva ("vetor2("+texto(a)+")");
  escreva (vetor2[a]);
}
para (a=0; a<2; a=a+1){
  escreva ("vetor3("+texto(a)+")");
  escreva (vetor3[a]);
}
se (vetor2[0]<vetor3[0] e vetor2[1]<vetor3[1]){
  vetor4[0]=vetor2[0];
  se (vetor3[0]<vetor2[1]){
  vetor4[1]=vetor3[0];
  vetor4[2]=vetor2[1];
  vetor4[3]=vetor3[1];
  }senao{
  vetor4[1]=vetor2[1];
  vetor4[2]=vetor3[0];
  vetor4[3]=vetor3[1];
  }
}
    
para (a=0; a<4; a=a+1){
  escreva ("vetor4("+texto(vetor4[a])+")");
}`

const Bhaskara = `funcao bhaskara(a,b,c){
  //A variável "d" vai simbolizar o Delta.
  //"a", "b", e "c" irão representar os coeficientes da equação.
  var d = b**2;
        var f = 4*a*c; 
  d = d-f;
  escreva("O valor de Delta é: " + texto(d));
  d = d**0.5;
  
  //Encontrando os valores de X1 e X2.
  var x1 = -b+d;
  x1 = x1/2*a;
  escreva("O valor de X1 é: "+ texto(x1));
  var x2 = -b-d;
  x2 = x2/2*a;
  escreva("O valor de X2 é: "+ texto(x2));
  //Resultado das substituições de X por X1 e X2 na equação.
  var r1 = x1**2;
  r1 = a*r1;
  r1 = b*x1 + r1;
  r1 = r1 + c;
  escreva("Substituindo X1 na equação obtém-se:"+ texto(r1));
  var r2 = x2**2;
  r2 = a*r2;
  r2 = b*x2 + r2;
  r2 = r2 + c;
  escreva("Substituindo X2 na equação obtém-se:"+ texto(r2));
}

//Insira o valor do coeficiente A:
 var a = 1;

//Insira o valor do coeficiente B:
 var b = -1;

//Insira o valor do coeficiente B:
 var c = -30;

bhaskara(a,b,c);`

const Fibonacci = `// Recursão para o cálculo da sequência de fibonacci

funcao fibonacci(n){
  se(n==0){
    retorna(0);
 }senao{
    se(n==1){
      retorna(1);
   }senao{
    var n1 = n-1;
    var n2 = n-2;
    var f1 = fibonacci(n1);
    var f2 = fibonacci(n2);
    retorna(f1 + f2);}
  }
}

var a = fibonacci(0);
escreva(a);
a = fibonacci(1);
escreva(a);
a = fibonacci(2);
escreva(a);
a = fibonacci(3);
escreva(a);
a = fibonacci(4);
escreva(a);
a = fibonacci(5);
escreva(a);`

const Perceptron = `var pesoInicial1 = 0.3;
var pesoInicial2 = 0.4;

var entrada1 = 1;
var entrada2 = 1;

var erro = 1;

var resultadoEsperado;

enquanto(erro!=0){
  se(entrada1 == 1){
    se(entrada2 == 1){
      resultadoEsperado = 1;
    }
  } senao {
    resultadoEsperado = 0;
  }
  
  var somatoria = pesoInicial1 * entrada1;
  somatoria = pesoInicial2 * entrada2 + somatoria;
  
  var resultado;
  
  se(somatoria < 1){
    resultado = 0;
  } senao{
    se(somatoria>=1){
      resultado = 1;
    }
  }
  
  escreva("resultado: " + texto(resultado));
  
  erro = resultadoEsperado - resultado;

  escreva("p1: " + texto(pesoInicial1));
  escreva("p2: " + texto(pesoInicial2));

  pesoInicial1 = 0.1 * entrada1 * erro + pesoInicial1;
  pesoInicial2 = 0.1 * entrada2 * erro + pesoInicial2;

  escreva("erro: " + texto(erro));
}`

const FilaEstatica = `funcao enfileirar (valorEntrada) {
  se (indexFinal == maximoDeElementos){
    escreva("Fila Cheia");
  } senao {
    filaEstatica[indexFinal] = valorEntrada;
    escreva("Valor inserido com sucesso: " + texto(filaEstatica[indexFinal]));
    retorna indexFinal = indexFinal + 1;
  }
}

funcao desenfileirar(){
  se (indexInicial == indexFinal){
    escreva("Fila Vazia") ;
  } senao {
    para (i = 0; i <= indexFinal; i=i+1){
      
      se(i+1 == indexFinal){
        indexFinal = indexFinal - 1;
        escreva("Valor retirado com sucesso.");
        
      } senao {
        filaEstatica[i] = filaEstatica[i+1];
      }
    }    
  }
}

funcao mostrar_fila () {
  se(indexInicial == indexFinal){
    escreva("Fila Vazia");
  } senao {  
    para (var i = 0; i < indexFinal; i = i + 1){
      escreva("index "+texto(i)); 
      escreva(texto(filaEstatica[i]));
    }
  }
}

var maximoDeElementos = 4;
var indexInicial = 0;
var indexFinal = 0;

//Variavel de controle em iterações
var i = 0;


var filaEstatica = [];


//Demonstração de uso das funções:
mostrar_fila();

var valorEntrada = 2;
enfileirar(valorEntrada);

var valorEntrada = 8;
enfileirar(valorEntrada);

var valorEntrada = 23;
enfileirar(valorEntrada);

var valorEntrada = 7;
enfileirar(valorEntrada);

mostrar_fila();

desenfileirar();

mostrar_fila();

var valorEntrada = 24;
enfileirar(valorEntrada);

mostrar_fila();`

const demos = {
  Exemplos,
  OlaMundo,
  Classe,
  MergeSort,
  Bhaskara,
  Fibonacci,
  Perceptron,
  FilaEstatica
}
