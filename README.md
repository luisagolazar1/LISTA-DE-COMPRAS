# Lista de Compras — GitHub + Vercel

## 1. Subir el proyecto a GitHub
1. Entrá a https://github.com y creá un repositorio nuevo (por ej. `lista-compras`), público o privado, sin agregar README (ya tiene uno).
2. Subí estos archivos: podés arrastrarlos en la página del repo ("uploading an existing file") o por terminal:
   ```
   git init
   git add .
   git commit -m "Primera version"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/lista-compras.git
   git push -u origin main
   ```

## 2. Desplegar en Vercel
1. Entrá a https://vercel.com y logueate con tu cuenta de GitHub.
2. "Add New" → "Project" → elegí el repo `lista-compras` → "Deploy".
   No hace falta tocar ninguna configuración, Vercel detecta el `index.html` y la carpeta `api/` solo.

## 3. Conectar la base de datos en la nube (Vercel KV)
1. Dentro del proyecto ya desplegado en Vercel, ir a la pestaña **Storage**.
2. "Create Database" → elegir **KV** (es gratis en el plan Hobby).
3. Conectala a este proyecto cuando te lo pida (esto crea las variables de entorno automáticamente).
4. Ir a **Deployments** → los tres puntos del último deploy → **Redeploy** (para que tome las variables nuevas).

## 4. Usarla
- Abrí la URL que te dio Vercel (algo como `https://lista-compras.vercel.app`) desde la compu y desde el celular.
- Los cambios se guardan en tu navegador al instante y se sincronizan con la nube en segundo plano (mirá el punto verde/rojo junto al título).
- Podés "agregar a pantalla de inicio" desde el navegador del celular para que te quede como ícono de app con el logo del carrito.

## Estructura
```
lista-compras/
├── index.html      # la app (frontend)
├── api/
│   └── data.js     # función que lee/guarda en Vercel KV
├── package.json
└── README.md
```
