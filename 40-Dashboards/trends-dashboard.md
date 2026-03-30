# 📊 Trends Dashboard

> **Última actualización:** `= this.file.mtime`

---

## 🔥 Resumen del Día

```dataviewjs
// Crear tarjetas de resumen del día
const today = new Date().toISOString().split('T')[0];
const dailyFolder = "10-Daily";

// Buscar Daily Note de hoy
const todayFile = app.vault.getMarkdownFiles()
    .find(f => f.path.includes(today) && f.path.startsWith(dailyFolder));

const container = document.createElement('div');
container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;';

const platforms = [
    { name: 'HackerNews', icon: '👨‍💻', color: '#ff6600' },
    { name: 'Reddit', icon: '🔴', color: '#ff4500' },
    { name: 'Bilibili', icon: '📺', color: '#fb7299' },
    { name: 'Dev.to', icon: '📝', color: '#0a0a0a' },
    { name: 'StackOverflow', icon: '💬', color: '#f48024' },
];

platforms.forEach(platform => {
    const card = document.createElement('div');
    card.style.cssText = `
        padding: 20px;
        background: linear-gradient(135deg, ${platform.color}11, ${platform.color}08);
        border-left: 4px solid ${platform.color};
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
    `;
    
    card.onmouseover = () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    };
    card.onmouseout = () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    };
    
    card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 28px;">${platform.icon}</span>
            <span style="font-size: 14px; font-weight: 600; color: var(--text-normal);">${platform.name}</span>
        </div>
        <div style="font-size: 32px; font-weight: bold; color: ${platform.color}; margin-bottom: 4px;">10</div>
        <div style="font-size: 12px; color: var(--text-muted);">trends hoy</div>
    `;
    
    container.appendChild(card);
});

dv.container.appendChild(container);
```

---

## 📈 Actividad de la Semana

```dataviewjs
// Crear gráfico de actividad semanal
const dailyFolder = "10-Daily";
const files = app.vault.getMarkdownFiles()
    .filter(f => f.path.startsWith(dailyFolder))
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 7);

const container = document.createElement('div');
container.style.cssText = 'margin: 24px 0; padding: 20px; background: var(--background-secondary); border-radius: 12px;';

const title = document.createElement('h3');
title.textContent = '📊 Trends Generados por Día';
title.style.cssText = 'margin: 0 0 20px 0; color: var(--text-normal); font-size: 16px;';
container.appendChild(title);

// Contenedor del gráfico
const chartContainer = document.createElement('div');
chartContainer.style.cssText = 'display: flex; align-items: flex-end; gap: 12px; height: 180px; padding: 20px 10px;';

files.forEach(file => {
    const date = new Date(file.stat.mtime);
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    const monthDay = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    
    const barWrapper = document.createElement('div');
    barWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%;';
    
    // Barra
    const bar = document.createElement('div');
    bar.style.cssText = `
        width: 100%;
        max-width: 60px;
        flex: 1;
        background: linear-gradient(to top, #7c3aed, #a78bfa, #c4b5fd);
        border-radius: 8px 8px 4px 4px;
        transition: all 0.3s ease;
        position: relative;
        min-height: 20px;
    `;
    
    // Efecto hover
    bar.onmouseover = () => {
        bar.style.opacity = '0.8';
        bar.style.transform = 'scale(1.05)';
    };
    bar.onmouseout = () => {
        bar.style.opacity = '1';
        bar.style.transform = 'scale(1)';
    };
    
    // Label
    const label = document.createElement('div');
    label.textContent = dayName;
    label.style.cssText = 'font-size: 11px; color: var(--text-muted); margin-top: 8px; text-align: center;';
    
    const dateLabel = document.createElement('div');
    dateLabel.textContent = monthDay;
    dateLabel.style.cssText = 'font-size: 10px; color: var(--text-faint); text-align: center;';
    
    barWrapper.appendChild(bar);
    barWrapper.appendChild(label);
    barWrapper.appendChild(dateLabel);
    chartContainer.appendChild(barWrapper);
});

container.appendChild(chartContainer);
dv.container.appendChild(container);
```

---

## 📰 Últimos Daily Digests

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "📄 Daily Note",
    date(file.day) as "📅 Fecha",
    plataformas as "📱 Plataformas"
FROM "10-Daily"
WHERE contains(tags, "daily-digest") OR contains(file.tags, "daily-digest")
SORT file.day DESC
LIMIT 10
```

---

## 🔍 Explorar por Plataforma

### 👨‍💻 HackerNews

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "Día",
    date(file.day) as "Fecha"
FROM "10-Daily"
WHERE contains(file.tags, "daily-digest")
SORT file.day DESC
LIMIT 7
```

### 🔴 Reddit

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "Día",
    date(file.day) as "Fecha"
FROM "10-Daily"
WHERE contains(file.tags, "daily-digest")
SORT file.day DESC
LIMIT 7
```

### 📺 Bilibili

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "Día",
    date(file.day) as "Fecha"
FROM "10-Daily"
WHERE contains(file.tags, "daily-digest")
SORT file.day DESC
LIMIT 7
```

### 📝 Dev.to

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "Día",
    date(file.day) as "Fecha"
FROM "10-Daily"
WHERE contains(file.tags, "daily-digest")
SORT file.day DESC
LIMIT 7
```

### 💬 StackOverflow

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "Día",
    date(file.day) as "Fecha"
FROM "10-Daily"
WHERE contains(file.tags, "daily-digest")
SORT file.day DESC
LIMIT 7
```

---

## 📅 Calendario de Actividad

> [!TIP] Cómo usar el calendario
> 1. Abre el plugin **Calendar** en la sidebar derecha
> 2. Click en cualquier fecha para ver/crear la Daily Note
> 3. Las notas con trends tienen el tag `#daily-digest`

```dataview
CALENDAR file.day
FROM "10-Daily"
```

---

## 📊 Estadísticas Globales

```dataviewjs
// Calcular estadísticas
const dailyFolder = "10-Daily";
const files = app.vault.getMarkdownFiles()
    .filter(f => f.path.startsWith(dailyFolder));

const totalDays = files.length;
const firstDate = files.length > 0 ? 
    new Date(Math.min(...files.map(f => f.stat.mtime))) : 
    new Date();
const daysRunning = Math.max(1, Math.floor((new Date() - firstDate) / (1000 * 60 * 60 * 24)));
const avgTrendsPerDay = 50; // 10 trends x 5 plataformas

const stats = [
    { label: 'Días con trends', value: totalDays, color: '#7c3aed' },
    { label: 'Trends totales', value: totalDays * avgTrendsPerDay, color: '#10b981' },
    { label: 'Plataformas', value: 5, color: '#f59e0b' },
    { label: 'Días activo', value: `${Math.round((totalDays / daysRunning) * 100)}%`, color: '#3b82f6' },
];

const container = document.createElement('div');
container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin: 24px 0;';

stats.forEach(stat => {
    const card = document.createElement('div');
    card.style.cssText = `
        padding: 20px;
        background: var(--background-secondary);
        border-radius: 12px;
        text-align: center;
        border: 2px solid ${stat.color}33;
    `;
    
    card.innerHTML = `
        <div style="font-size: 36px; font-weight: bold; color: ${stat.color}; margin-bottom: 8px;">${stat.value}</div>
        <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${stat.label}</div>
    `;
    
    container.appendChild(card);
});

dv.container.appendChild(container);
```

---

## ⚡ Quick Actions

> [!TIP] Acciones Rápidas
> - [Ejecutar Daily Digest](obsidian://advanced-uri?vault=DonGeeo87&command=opencli-inject) → `npm run inject`
> - [[30-Templates/daily-digest-template]] → Ver template
> - [[00-Inbox/daily-digests]] → Explorar backups

---

*Dashboard automático con Dataview + Visual Cards*
