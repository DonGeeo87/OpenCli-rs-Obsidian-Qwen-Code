# AGENTS.md - Agentes de Codificación

Este repositorio es una **bóveda de Obsidian** ubicada en `C:\DonGeeo87`.

## Estado del Proyecto

Esta bóveda contiene notas y memorias en formato Markdown. No es un proyecto de código tradicional con build/lint/test.
- **Tipo**: Bóveda de Obsidian (note-taking)
- **Ubicación**: `C:\Users\ginte\.claude\projects\C--DonGeeo87\.claude\` para memorias de sesión

## Comandos de Desarrollo

### Construcción y Ejecución
No hay comandos de build disponibles para bóvedas de Obsidian.

### Pruebas
No hay pruebas unitarias en una bóveda de Obsidian.

### Linting
No hay linting disponible.

## Guías de Estilo de Código

### Convenciones Generales

#### Imports
```markdown
<!-- Enlaces en Obsidian -->
[[nombre-del-archivo]]
[[nombre-del-archivo|alias]]
[texto del enlace](url)
```

#### Formato de Notas
- Usar frontmatter YAML para metadatos:
```yaml
---
title: Título de la nota
tags: [tag1, tag2]
date: 2026-03-30
---
```
- Encabezados jerárquicos (# ## ###)
- Listas con guiones (-)
- Código con backticks triples (```)

#### Tipos y Metadatos
- Tags en minúsculas con guiones: `[[gestion-proyectos]]`
- Categorías separadas: `01-Planificación/`
- Fechas en formato ISO: `YYYY-MM-DD`

#### Convenciones de Nombres
- Notas: PascalCase o kebab-case consistente
- Tags: minúsculas, guiones entre palabras
- Carpetas: número-prefixed para orden (01-, 02-)

#### Manejo de Errores
- Usar bloques de código callout en Obsidian:
```markdown
> [!warning]
> Mensaje de advertencia

> [!error]
> Mensaje de error
```

### Estructura de Archivos

```
C:\DonGeeo87\
├── .obsidian/          # Configuración de Obsidian
├── .remember/           # Notas recordatorias
├── CLAUDE.md            # Configuración para Claude
├── AGENTS.md            # Este archivo
└── *.md                 # Notas de la bóveda
```

### Integración con Herramientas

#### Claude Code
- Configuración en CLAUDE.md
- Memorias de sesión en `C:\Users\ginte\.claude\projects\C--DonGeeo87\.claude\`

#### Obsidian
- Plugins recomendados:
  - Dataview (para consultas de metadatos)
  - Templater (para plantillas)
  - Obsidian Git (para versionado)

## Notas Adicionales

### Para Agentes
1. Esta bóveda es para gestión de conocimiento, no código de producción
2. Al crear notas, usar frontmatter apropiado
3. Mantener consistencia en nomenclatura de tags
4. Usar enlaces bidireccionales cuando sea relevante

### Referencias
- Configuración principal: CLAUDE.md
- Documentación Obsidian: https://help.obsidian.md/