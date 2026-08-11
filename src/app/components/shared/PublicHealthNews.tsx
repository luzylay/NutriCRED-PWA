import { useState, useEffect } from "react";
import { Rss, Clock, ExternalLink, AlertTriangle, ShieldCheck } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  categories: string[];
}

const RSS_URL = "https://www.paho.org/es/rss.xml"; // OPS (PAHO) Noticias Oficiales
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
const CACHE_KEY = "yanapiri_news_cache";
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export function PublicHealthNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // 1. Check Cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          if (now - timestamp < CACHE_DURATION_MS) {
            setNews(data);
            setLoading(false);
            return;
          }
        }

        // 2. Fetch from API
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error fetching news");
        
        const json = await response.json();
        
        if (json.status === "ok" && json.items) {
          const fetchedNews = json.items.slice(0, 4).map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            categories: item.categories || [],
          }));

          setNews(fetchedNews);
          
          // Save to Cache
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: fetchedNews, timestamp: Date.now() })
          );
        } else {
          throw new Error("Invalid RSS data");
        }
      } catch (err) {
        console.error("Failed to load health news:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-4 flex items-center gap-3">
        <AlertTriangle className="size-5 text-red-500 shrink-0" />
        <p className="text-xs text-red-700 dark:text-red-400 font-medium">
          No se pudieron cargar las alertas de salud actuales. Verifica tu conexión a internet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
            <Rss className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold font-nunito text-foreground leading-tight flex items-center gap-1.5">
              Noticias Oficiales <ShieldCheck className="size-3.5 text-emerald-500" />
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              En Vivo • OPS / OMS
            </p>
          </div>
        </div>
        
        {loading && (
          <div className="size-4 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
        )}
      </div>

      <div className="divide-y divide-border/50">
        {loading && news.length === 0 ? (
          <div className="p-5 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted/60 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          news.map((item, idx) => {
            const date = new Date(item.pubDate.replace(' ', 'T'));
            const isRecent = (Date.now() - date.getTime()) < (3 * 24 * 60 * 60 * 1000); // 3 days

            return (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 flex gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isRecent && (
                      <span className="bg-red-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded animate-pulse">
                        ÚLTIMO MINUTO
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="size-3" />
                      {date.toLocaleDateString("es-PE", { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </div>
                <div className="shrink-0 flex items-center justify-center">
                  <ExternalLink className="size-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </a>
            );
          })
        )}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-950/20 px-4 py-2 text-center border-t border-blue-100 dark:border-blue-900/30">
        <p className="text-[9px] text-blue-800 dark:text-blue-300/70 font-semibold uppercase tracking-wider">
          Información verificada por la Organización Panamericana de la Salud
        </p>
      </div>
    </div>
  );
}
