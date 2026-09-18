let newsLoaded = false;

async function fetchNews() {
    const container = document.getElementById('news-container');
    
    // Mostrar animación de carga
    container.innerHTML = `
        <div class="bg-stone-100 rounded-xl p-5 space-y-3 pulse border border-stone-200">
            <div class="h-4 bg-stone-300 rounded w-3/4"></div>
            <div class="h-4 bg-stone-300 rounded w-1/2"></div>
        </div>
        <div class="bg-stone-100 rounded-xl p-5 space-y-3 pulse border border-stone-200">
            <div class="h-4 bg-stone-300 rounded w-3/4"></div>
            <div class="h-4 bg-stone-300 rounded w-1/2"></div>
        </div>
        <div class="bg-stone-100 rounded-xl p-5 space-y-3 pulse border border-stone-200">
            <div class="h-4 bg-stone-300 rounded w-3/4"></div>
            <div class="h-4 bg-stone-300 rounded w-1/2"></div>
        </div>
    `;
    
    try {
        // Usamos el feed de Google News procesado nativamente por rss2json (Evita errores de CORS y XML)
        const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=economia+finanzas+mexico&hl=es-419&gl=MX&ceid=MX:es-419');
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Verificamos que la API haya respondido correctamente
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            container.innerHTML = ''; // Limpiamos la animación
            const articles = data.items.slice(0, 9);
            
            articles.forEach(article => {
                // Extraer el nombre del medio noticiero
                let cleanTitle = article.title;
                let source = "NOTICIA ECONÓMICA";
                if (cleanTitle.includes(" - ")) {
                    const parts = cleanTitle.split(" - ");
                    source = parts.pop(); // El medio suele estar al final
                    cleanTitle = parts.join(" - ");
                }

                // Formatear la fecha
                const dateObj = new Date(article.pubDate);
                const dateString = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' });

                // Crear la tarjeta
                const card = document.createElement('a');
                card.href = article.link;
                card.target = '_blank';
                card.className = "block bg-white hover:bg-stone-50 border border-stone-200 rounded-xl p-5 transition-shadow hover:shadow-md hover:border-sky-300 group flex flex-col justify-between";
                
                card.innerHTML = `
                    <div>
                        <span class="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-2 block">${source}</span>
                        <h3 class="text-sm font-bold text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">${cleanTitle}</h3>
                    </div>
                    <div class="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                        <span class="text-[11px] text-slate-500 font-medium">🕒 ${dateString}</span>
                        <span class="text-sky-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                `;
                container.appendChild(card);
            });
            newsLoaded = true;
        } else {
            throw new Error("Formato inválido o vacío retornado por la API");
        }
    } catch (error) {
        console.error("Error obteniendo noticias:", error);
        container.innerHTML = `
            <div class="col-span-full p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-semibold text-center">
                No se pudieron cargar las noticias en este momento. Intenta actualizar más tarde.
            </div>
        `;
    }
}
