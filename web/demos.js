const Exemplos = '';
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

const Bhaskara = `var a; var b; var c; var d; var c; var f; var x1; var x2; var r1; var r2;

funcao bhaskara(d,a,b,c,x1,x2){
  //A variável "d" vai simbolizar o Delta.
  //"a", "b", e "c" irão representar os coeficientes da equação.
  d = b**2;
        var f = 4*a*c; 
  d = d-f;
  escreva("O valor de Delta é: " + texto(d));
  d = d**0.5;
  
  //Encontrando os valores de X1 e X2.
  x1 = -b+d;
  x1 = x1/2*a;
  escreva("O valor de X1 é: "+ texto(x1));
  x2 = -b-d;
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

bhaskara(d,a,b,c,x1,x2);`

const demos = {
  Exemplos,
  Classe,
  MergeSort,
  Bhaskara
}
