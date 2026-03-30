# 🎯 Centro de Control Principal

> Tu vista unificada de trends y menciones - Actualizado: `= this.file.mtime`

---

## 📅 Hoy

```dataviewjs
// Buscar Daily Note de hoy
const today = new Date().toISOString().split('T')[0];
const todayFile = app.vault.getMarkdownFiles()
    .find(f => f.path.includes(today) && f.path.startsWith("10-Daily"));

if (todayFile) {
    dv.paragraph(`✅ **Daily Note creada:** [[${todayFile.name}]]`);
    dv.paragraph(`📍 **Ruta:** ${todayFile.path}`);
} else {
    dv.paragraph(`⏳ **Daily Note de hoy aún no creada**`);
    dv.paragraph(`🔔 **Próxima ejecución:** 8:00 AM (automática)`);
}
```

---

## 🔥 Trends del Día (Vista Rápida)

```dataviewjs
// Crear mini tarjetas de tendencias
const platforms = [
    { name: 'HackerNews', icon: '👨‍💻', color: '#ff6600', count: 10 },
    { name: 'Reddit', icon: '🔴', color: '#ff4500', count: 10 },
    { name: 'Bilibili', icon: '📺', color: '#fb7299', count: 10 },
    { name: 'Dev.to', icon: '📝', color: '#0a0a0a', count: 10 },
    { name: 'StackOverflow', icon: '💬', color: '#f48024', count: 10 },
];

const container = document.createElement('div');
container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin: 16px 0;';

platforms.forEach(p => {
    const card = document.createElement('div');
    card.style.cssText = `
        padding: 12px;
        background: ${p.color}11;
        border-radius: 8px;
        text-align: center;
        border: 1px solid ${p.color}33;
    `;
    
    card.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 4px;">${p.icon}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">${p.name}</div>
        <div style="font-size: 20px; font-weight: bold; color: ${p.color};">${p.count}</div>
    `;
    
    container.appendChild(card);
});

dv.container.appendChild(container);
```

[[40-Dashboards/trends-dashboard|Ver Trends Dashboard Completo →]]

---

## 🔍 Menciones Recientes

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "📄 Reporte",
    keyword as "🔑 Keyword",
    file.mtime as "Actualizado"
FROM "00-Inbox/brand-mentions"
SORT file.mtime DESC
LIMIT 5
```

[[40-Dashboards/brand-dashboard|Ver Brand Dashboard Completo →]]

---

## 📊 Stats Rápidas

```dataviewjs
// Calcular stats rápidas
const dailyFiles = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("10-Daily"));
const brandFiles = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("00-Inbox/brand-mentions"));

const statsContainer = document.createElement('div');
statsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0;';

const stats = [
    { label: 'Daily Notes', value: dailyFiles.length, icon: '📅', color: '#7c3aed' },
    { label: 'Brand Reports', value: brandFiles.length, icon: '🔍', color: '#10b981' },
    { label: 'Trends Totales', value: dailyFiles.length * 50, icon: '🔥', color: '#f59e0b' },
];

stats.forEach(stat => {
    const card = document.createElement('div');
    card.style.cssText = `
        padding: 16px;
        background: var(--background-secondary);
        border-radius: 8px;
        text-align: center;
        border: 2px solid ${stat.color}33;
    `;
    
    card.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">${stat.icon}</div>
        <div style="font-size: 28px; font-weight: bold; color: ${stat.color};">${stat.value}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${stat.label}</div>
    `;
    
    statsContainer.appendChild(card);
});

dv.container.appendChild(statsContainer);
```

---

## ⏰ Próxima Automatización

> [!INFO] Schedule Automatizado
> | Task | Horario | Estado |
> |------|---------|--------|
> | 📅 Daily Digest | 8:00 AM | ⏰ Programado |
> | 🔍 Brand Monitor | 12:00 PM | ⏰ Programado |
> | 💾 Vault Backup | 6:00 PM | ⏰ Programado |

**Próxima ejecución:** Mañana 8:00 AM - Daily Digest

---

## 🚀 Acciones Rápidas

```dataviewjs
const actions = [
    { 
        label: 'Ejecutar Daily Digest', 
        icon: '📰', 
        command: 'npm run inject',
        color: '#7c3aed',
        desc: 'Trends → Obsidian'
    },
    { 
        label: 'Ejecutar Brand Monitor', 
        icon: '🔍', 
        command: 'npm run monitor',
        color: '#10b981',
        desc: 'Menciones → Obsidian'
    },
    { 
        label: 'Ver Daily Note', 
        icon: '📅', 
        command: 'daily-note',
        color: '#f59e0b',
        desc: 'Hoy'
    },
    { 
        label: 'Explorar Backups', 
        icon: '📁', 
        command: 'explore',
        color: '#3b82f6',
        desc: '00-Inbox'
    },
];

const container = document.createElement('div');
container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;';

actions.forEach(action => {
    const button = document.createElement('div');
    button.style.cssText = `
        padding: 16px;
        background: linear-gradient(135deg, ${action.color}11, ${action.color}08);
        border: 2px solid ${action.color}33;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    
    button.onmouseover = () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = `0 4px 12px ${action.color}33`;
    };
    button.onmouseout = () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    };
    
    button.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span style="font-size: 24px;">${action.icon}</span>
            <span style="font-weight: 600; color: var(--text-normal);">${action.label}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">${action.desc}</div>
        <div style="font-size: 11px; color: ${action.color}; margin-top: 8px; font-family: monospace;">${action.command}</div>
    `;
    
    container.appendChild(button);
});

dv.container.appendChild(container);
```

---

## 📈 Actividad Reciente

```dataview
TABLE 
    file.link as "📄 Archivo",
    file.mtime as "Actualizado",
    file.size as "Tamaño"
FROM "00-Inbox, 10-Daily, 20-Brand"
SORT file.mtime DESC
LIMIT 10
```

---

## 🔖 Tags Populares

```dataviewjs
// Contar tags
const tagCount = {};
const files = app.vault.getMarkdownFiles();

files.forEach(file => {
    const cache = app.metadataCache.getFileCache(file);
    if (cache && cache.tags) {
        cache.tags.forEach(tag => {
            const tagName = tag.tag;
            tagCount[tagName] = (tagCount[tagName] || 0) + 1;
        });
    }
});

// Ordenar y mostrar top tags
const sortedTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

const container = document.createElement('div');
container.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0;';

sortedTags.forEach(([tag, count]) => {
    const tagEl = document.createElement('span');
    tagEl.style.cssText = `
        padding: 6px 12px;
        background: var(--background-secondary);
        border-radius: 16px;
        font-size: 12px;
        color: var(--text-normal);
        border: 1px solid var(--background-modifier-border);
    `;
    
    tagEl.innerHTML = `#${tag.replace('#', '')} <span style="color: var(--text-muted);">(${count})</span>`;
    container.appendChild(tagEl);
});

dv.container.appendChild(container);
```

---

## 📚 Navegación Rápida

| Sección | Descripción | Link |
|---------|-------------|------|
| 📊 Trends Dashboard | Dashboard completo de tendencias | [[trends-dashboard|Abrir →]] |
| 🔍 Brand Dashboard | Dashboard de menciones de marcas | [[brand-dashboard|Abrir →]] |
| 📅 Daily Notes | Todas las Daily Notes | [10-Daily](obsidian://show-file?id=10-Daily) |
| 📁 Inbox | Bandeja de entrada de datos | [00-Inbox](obsidian://show-file?id=00-Inbox) |
| ⚙️ Templates | Templates de automatización | [30-Templates](obsidian://show-file?id=30-Templates) |

---

*Centro de Control Principal - opencli-rs-tools*  
*Última actualización: `= this.file.mtime`*
