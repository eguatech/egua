# Guia de contribuição da Linguagem Egua

Olá! Estamos muito felizes que você quer contribuir com nosso projeto. Antes de contribuir, por favor tenha certeza de seguir todas as recomendações e submeter.

## Introdução

O desenvolvimento da linguagem egua, assim como a utilização da linguagem, possui uma estrutura que facilita a contribuição, principalmente em termos de biblioteca e métodos internos da linguagem, entretanto essa facilidade só é garantida a partir de algumas práticas e regras que devem ser seguidas, para facilitar a análise de pull requests e garantir a integridade da linguagem e funcionalidade da linguagem em casa commit, já que prezamos pela entrega continua, onde garantimos que o usuário possua a versão mais recente da linguagem para ser utilizada.

## Montando ambiente

### Requisitos de sistema

- Windows 10 com WSL ou Linux Ubuntu ou Linux mint >= 18.04
    - [Guia de instalação do WSL no Windows 10](https://docs.microsoft.com/pt-br/windows/wsl/install-win10)

- Node.js versão LTS >= 12 [link instalação]
    - [Guia de instalação do Node.js no WSL ou Linux](https://github.com/nodesource/distributions/blob/master/README.md#deb)

- NPM >= 6
    > Vale lembrar que ainda não efetuamos testes para garantir o funcionamento do Egua no NPM 7.

- Browserify >= 16.0.0
    ```sh
    npm install -g browserify
    ```

## Como contribuir

### Contribuindo com bibliotecas para a linguagem

Possuímos um vídeo que mostra um exemplo de como efetuar a criação de uma biblioteca:

[![](http://img.youtube.com/vi/CZw0-y4Em2U/0.jpg)](http://www.youtube.com/watch?v=CZw0-y4Em2U "")

Palestra sobre a criação de bibliotecas na BrasilJS on the reoad Natal/Belém 2020:

[![](http://img.youtube.com/vi/W2LccJacNXE/0.jpg)](http://www.youtube.com/watch?v=W2LccJacNXE "")

### Contribuindo com o core da linguagem

A contribuição com o core da linguagem é uma tarefa mais complexa, pois você deverá ter conhecimento em estruturas de interpretadores.

Portanto temos as seguintes recomendações:

| Artigos | Vídeos |
|---|---|
| [Como é desenvolvida uma linguagem de programação?](https://pt.stackoverflow.com/questions/124436/como-%C3%A9-desenvolvida-uma-linguagem-de-programa%C3%A7%C3%A3o#:~:text=Criar%20uma%20linguagem%20de%20programa%C3%A7%C3%A3o,%C3%A9%20algo%20conceitual%2C%20%C3%A9%20abstrata.) | [Tutorial criando uma linguagem de programação em Python](https://www.youtube.com/watch?v=9tSuJzwe9Ok&list=PLP7hn9TNf1CEl8A8jQfZSRYcgUIqBhIJU) |
| [Criando linguagem de programação em Node.js](https://repl.it/talk/learn/Making-your-own-programming-language-with-NodeJS/45779) | [Criando uma linguagem de programação em JavaScript](https://youtu.be/YpT-GpcHf2g) |

Durante e após o seu desenvolvimento para a contribuição recomendamos sempre executar os testes necessários, sendo eles os da sua alteração e os automatizados. Não se preocupe, esses testes serão executados de maneira automática após o seu commit.

Solicitamos também que você adicione um exemplo da funcionalidade que você implementou no arquivo `tests/tests.egua` para que os testes unitários sejam executados na sua funcionalidade. Vale lemnbrar que sua contribuição também será revisada manualmente pelo time de desenvolvimento da linguagem.

Os comandos de teste são:

```sh
# Execução dos testes unitários
npm run teste
```

Após o desenvolvimento ser concluído, é necessário ter a build web do projeto, que é feita com o comando: 
```sh
npm run build-web
```

> Sugerimos que você abra o arquivo `index.html` em seu navegador para testar as funcionalidades implementadas por você! 

Solicitamos também que você atualize a chave `version` do arquivo `package.json`, pois só assim a ferramenta de CD será capaz de implementar suas atualizações em produção.

Por fim, seu PR deve ser efetuado na branch `desenvolvimento` e solicitamos que você abra uma issue no repositório [Docs](https://github.com/eguatech/docs) informando a sua implementação e uma breve explicação para ser adicionado na documentação.


## Resumo

De maneira bem resumida eis o que precisa ser feito:

- [ ] Montar o ambiente.

- [ ] Efetuar as suas alterações.

- [ ] Executar os testes unitários.

- [ ] Executar a build para web do projeto.

- [ ] Testar localmente suas alterações.

- [ ] Atualizar versão no arquivo `package.json`

- [ ] Abrir issue no repositório Docs.

## Agradecimentos

Desde já agradecemos de coração pela sua contribuição ao projeto. xD
