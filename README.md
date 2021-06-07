# Instagram Feed Imagens Scrapper

Script para buscar as imagens do Instagram sem ter que integrar via API.

O código utiliza do ```Puppeteer``` para abrir um navegador, fazer o login com uma conta pré definida no ```.env```, redireciona para a tela do perfil que deseja fazer o scrap e gera um json.

Depois de gerado ele le esse arquivo para evitar multiplas requisições. A validação é feita a cada minuto.

Para rodar em desenvolvimento:

```
yarn dev
ou
npm run dev
```

Produção:

```
yarn start
ou npm start
```