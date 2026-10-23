   const BASE = 'http://localhost:3000/api';

   const post = async (path, body) => {
     const r = await fetch(BASE + path, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(body),
     });
     return r.status;
   };

   (async () => {
     for (let i = 1; i <= 25; i++) {
       const n = String(i).padStart(2, '0');
       const cat = await post('/categories', {
         name: i % 2 ? `Info ${n}` : `Otros ${n}`,
         slug: `cat-${n}`,
         description: `Categoria de prueba ${n}`,
         active: i % 3 !== 0,
       });
       const usr = await post('/users', {
         name: i % 2 ? `Anna ${n}` : `Luis ${n}`,
         email: `usuario${n}@example.com`,
         password: 'clave-de-prueba-123',
       });
       console.log(n, 'categoria:', cat, 'usuario:', usr);
     }
   })();