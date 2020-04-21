const exemplos = '';
const classe = `classe Test {
  a() {
    escreva("hello");
  }
}

var test = Test();
test.a();


classe Test {
  construtor() {
    escreva(isto);
  }
}

var test = Test();

classe A {
  test() {
    escreva("yes");
  }
}

classe B herda A {
    a() {
        escreva("a");
    }
}

var a = B();
a.test();
a.a();`

const tudo = `
  
  var a = [1, 2, 3];
  escreva(a[0]);
  
  var a = {'a': 1, 'b': 9};
  escreva(a['b']);
  
  
  
  var text = "1.8";
  escreva(inteiro(text));
  
  var haha = nulo;
  escreva(haha);
  
  funcao test(a='val1', b='val2', c='val3') {
    escreva(a);
    escreva(b);
    escreva(c);
  }
  
  test(); // prints "val1", "val2" and "val3"
  test("1"); // prints "1", "val2, and "val3"
  test('1', '2', '3', '4'); // prints "1", "2" and "[3, 4]"
  
  para (var i = 0; i < 5; i = i + 1) {
    continua;
    escreva(i);
  }
  
  escolha (2) {
    caso "1":
      escreva("matched option 1");
  
    caso 1:
      escreva("matched option 2");
  
    padrao:
      escreva("no match");
  }
  
  var a = 2;
  se (a == 1) {
    escreva('match 1');
  } senao {
    escreva("rola");
  }
  
  escreva("a");
  
  var a = [1, 2, 6];
  escreva(tamanho(a));
  
  escreva(1 | 1);
  
  var os = importar("os");
  os.listardir("/usr");
  
  var i = 0;
  faca {
    escreva(i);
    i = i + 1;
  } enquanto (i < 5)
  
  escreva("a");
  
  escreva(0 | 0);
  
  escreva('b' em ['b']);`

const demos = {
  exemplos,
  classe,
  tudo
}


