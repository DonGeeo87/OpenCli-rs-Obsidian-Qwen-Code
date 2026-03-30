# 📊 Dataview Configuration

## ✅ Plugins Instalados
- [x] Calendar
- [x] Dataview
- [x] Heatmap Calendar

---

## ⚙️ Dataview Settings

### Recommended Configuration

En Obsidian: **Settings → Dataview**

```yaml
# Query Settings
dataview.default-query-sort: "file.ctime"
dataview.default-query-limit: 20

# Render Settings
dataview.render-null-as: "`-`"
dataview.task-list-highlight-on-complete: true

# Frontmatter
dataview.inline-field-allowlist: ""
dataview.inline-field-exclude: ""
```

---

## 📅 Calendar Plugin

### Uso
- Click en el ícono de Calendar en la sidebar derecha
- Click en una fecha → Crea/abre Daily Note
- Las Daily Notes con trends se marcan automáticamente

### Daily Notes Location
Configura en **Settings → Daily Notes**:
- **Folder**: `10-Daily`
- **Template**: `30-Templates/daily-digest-template.md`

---

## 🔥 Heatmap Calendar

### Configurar para Daily Digests

1. Crea una nueva nota: `40-Dashboards/activity-heatmap.md`
2. Agrega este código:

````markdown
# 📈 Activity Heatmap

```dataviewjs
const notes = app.vault.getMarkdownFiles()
    .filter(f => f.path.startsWith("10-Daily"))
    .map(f => {
        const cache = app.metadataCache.getFileCache(f);
        return {
            path: f.path,
            name: f.name,
            ctime: f.stat.ctime,
            mtime: f.stat.mtime,
            tags: cache?.tags?.map(t => t.tag) || []
        };
    });

// Contar notas por día
const activityMap = {};
notes.forEach(note => {
    const date = new Date(note.mtime).toISOString().split('T')[0];
    activityMap[date] = (activityMap[date] || 0) + 1;
});

// Render heatmap
dv.span('');
const container = document.createElement('div');
container.className = 'heatmap-container';

// Simple heatmap visualization
const dates = Object.keys(activityMap).sort();
const maxCount = Math.max(...Object.values(activityMap));

dates.forEach(date => {
    const count = activityMap[date];
    const intensity = Math.ceil((count / maxCount) * 4);
    const day = document.createElement('div');
    day.className = `heatmap-day level-${intensity}`;
    day.title = `${date}: ${count} items`;
    day.style.cssText = `
        display: inline-block;
        width: 10px;
        height: 10px;
        margin: 1px;
        background-color: ${['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'][intensity]};
        border-radius: 2px;
    `;
    container.appendChild(day);
});

dv.container.appendChild(container);
```
````

---

## 📋 Queries Listos para Usar

### Ver todas las Daily Notes con Trends

````markdown
```dataview
TABLE fecha, plataformas, file.mtime as "Actualizado"
FROM "10-Daily"
WHERE contains(tags, "daily-digest")
SORT fecha DESC
LIMIT 30
```
````

### Ver menciones de una keyword específica

````markdown
```dataview
TABLE keyword, plataformas, file.mtime as "Actualizado"
FROM "20-Brand/reports"
WHERE contains(keywords, "opencli-rs")
SORT file.day DESC
LIMIT 10
```
````

### Contar menciones por plataforma

````markdown
```dataview
TABLE length(archivo) as "Menciones"
FROM "00-Inbox/brand-mentions"
FLATTEN file.tags as plataforma
GROUP BY plataforma
```
````

### Actividad de la última semana

````markdown
```dataview
TABLE 
    file.day as "Día",
    file.mtime as "Actualizado"
FROM "10-Daily"
WHERE file.day >= (date(now) - dur(7 days))
SORT file.day DESC
```
````

---

## 🎯 Dashboard Principal

Crea `40-Dashboards/main-dashboard.md`:

````markdown
# 🎯 Centro de Control Principal

> Última actualización: `= this.file.mtime`

## 📅 Hoy

```dataview
TABLE WITHOUT ID
    link(file.link, file.name) as "Daily Note",
    fecha as "Fecha",
    plataformas as "Plataformas"
FROM "10-Daily"
WHERE fecha = date(this.file.day)
```

## 🔥 Últimos Trends

```dataview
TABLE 
    fecha as "Fecha",
    plataformas as "Plataformas"
FROM "00-Inbox/daily-digests"
SORT fecha DESC
LIMIT 5
```

## 🔍 Últimas Menciones

```dataview
TABLE 
    keyword as "Keyword",
    file.mtime as "Actualizado"
FROM "00-Inbox/brand-mentions"
SORT file.mtime DESC
LIMIT 5
```

## 📈 Stats de la Semana

```dataviewjs
const notes = dv.pages('"10-Daily"')
    .where(p => p.file.day >= dv.date("now") - dv.duration("7 days"))
    .length;

dv.paragraph(`**Daily Notes creadas:** ${notes}`);
dv.paragraph(`**Promedio por día:** ${(notes / 7).toFixed(1)}`);
```
````

---

## 🔧 Troubleshooting

### Dataview no muestra resultados
1. Verifica que Dataview esté habilitado: **Settings → Community Plugins**
2. Revisa que el path en la query sea correcto
3. Asegúrate de que el frontmatter tenga los tags correctos

### Calendar no muestra Daily Notes
1. Configura la carpeta de Daily Notes: **Settings → Daily Notes → Folder**
2. Establece: `10-Daily`

### Heatmap no funciona
1. Asegúrate de tener **Heatmap Calendar** instalado
2. Configura el path correcto en los settings del plugin

---

*Configuración de Dataview para opencli-rs-tools*
