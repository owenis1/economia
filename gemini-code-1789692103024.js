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
        // Usamos Google News enfocado en Economía y México pasado por AllOrigins para evadir CORS
        const targetUrl = encodeURIComponent('https://news.google.com/rss/search?q=economia+mexico&hl=es-419&gl=MX&ceid=MX:es-419');
        const apiUrl = `https://api.allorigins.win/get?url=${targetUrl}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error en la red');
        
        const data = await response.json();
        
        // Convertimos el texto XML crudo en un documento navegable
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 9);
        
        if (items.length > 0) {
            container.innerHTML = ''; // Limpiamos la animación
            
            items.forEach(item => {
                const title = item.querySelector("title")?.textContent || 'Sin título';
                const link = item.querySelector("link")?.textContent || '#';
                const pubDate = item.querySelector("pubDate")?.textContent;
                
                // Extraer el nombre del medio noticiero (Suele venir al final del título tras un guion)
                let cleanTitle = title;
                let source = "NOTICIA ECONÓMICA";
                if (title.includes(" - ")) {
                    const parts = title.split(" - ");
                    source = parts.pop(); // El último elemento es el medio (ej. El Financiero, El Economista)
                    cleanTitle = parts.join(" - ");
                }

                const dateObj = new Date(pubDate);
                const dateString = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' });

                const card = document.createElement('a');
                card.href = link;
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
            throw new Error("No se encontraron noticias en el XML");
        }
    } catch (error) {
        console.error("Error procesando noticias:", error);
        container.innerHTML = `
            <div class="col-span-full p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-semibold text-center">
                No se pudieron cargar las noticias en este momento. Intenta actualizar más tarde.
            </div>
        `;
    }
}