# 2038 meme generator web app

made with `create-react-app`

### develop

```
npm i
npm start
```

### build

```
npm run build
```

### prepare fonts

The large TTF font creates rendering problems. Pick only the glyphs that are actually used in config.json:

```
docker run --rm -it -v `pwd`:/app sandinh/fonttools sh -c "pyftsubset /app/public/fonts/ArialUnicode-Bold.ttf --output-file=/app/public/fonts/arial-2038.ttf --text-file=/app/src/config.json"
```
