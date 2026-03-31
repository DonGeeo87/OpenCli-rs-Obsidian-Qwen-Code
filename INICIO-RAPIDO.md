# 🚀 Guía de Inicio Rápido - Jess Vitrofusión

> **Primeros pasos con ExportaRadar**

---

## 📍 Dashboard en Notion

**Link:** https://www.notion.so/3344821260be81bc91d4cc5bfc0e309f

**Compartir con:** `guerrerobritocarlos@gmail.com`

---

## 🎯 Flujo Completo (Paso a Paso)

### **Paso 1: Buscar Tiendas** (Giorgio lo hace)

```bash
npm run exporta:buscar
```

**Resultado:** 100 tiendas encontradas en Europa

---

### **Paso 2: Generar Emails en Notion** (Giorgio lo hace)

```bash
npm run exporta:sync
```

**Qué hace:**
- Lee tiendas encontradas
- Genera emails personalizados
- Crea entradas en "📧 Emails Enviados"

---

### **Paso 3: Revisar y Aprobar Emails** (TUS PAPÁS HACEN ESTO)

1. **Abrir Notion:**
   - Ir a: https://www.notion.so/3344821260be81bc91d4cc5bfc0e309f

2. **Ver "📧 Emails Enviados":**
   - Verán una lista con todos los emails generados

3. **Revisar "Email Borrador":**
   - Leer el email para asegurarse de que está bien escrito
   - Verificar que el sitio web `https://jessvitrofusion.art/` esté incluido
   - Verificar que los nombres (Carlos, Jessica) estén correctos

4. **Marcar "¿Enviar?":**
   - Si el email está bien, **marcar el checkbox** ✅
   - El sistema enviará automáticamente en los próximos 5 minutos

---

### **Paso 4: Envío Automático** (El sistema lo hace)

**Cada 5 minutos:**
- El sistema revisa emails con checkbox ✅ marcado
- Envía 2 emails por vez
- Actualiza el estado a "✅ Enviado"

**Tus papás NO tienen que hacer nada aquí.**

---

### **Paso 5: Recibir Respuestas**

**Emails de respuesta llegan a:**
- `guerrerobritocarlos@gmail.com` (principal)
- `chicjessy@gmail.com` (copia)

**Cuando llegue una respuesta:**
1. Ir a Notion → "📧 Emails Enviados"
2. Buscar la tienda que respondió
3. Actualizar "Respuesta" a "✅ Sí - Positivo"
4. Poner fecha en "Seguimiento" para la próxima semana

---

## 📊 Dashboard en Notion

### **Database "🏪 Tiendas/Prospectos"**

| Columna | Qué es |
|---------|--------|
| `Nombre` | Nombre de la tienda |
| `País` | País de la tienda |
| `Email` | Email de contacto |
| `Website` | Sitio web de la tienda |
| `Estado` | 🆕 Por contactar, 📧 Contactado, ✅ Respondió |

---

### **Database "📧 Emails Enviados"**

| Columna | Qué es | Qué haces tú |
|---------|--------|--------------|
| `Tienda` | Nombre de la tienda | - |
| `País` | País | - |
| `Email Tienda` | Email del destinatario | Verificar |
| `Email Borrador` | Email para revisar | **LEER ANTES DE ENVIAR** |
| `¿Enviar?` | Checkbox para aprobar | **MARCAR ✅** |
| `Estado` | Estado del envío | - |
| `Fecha Envío` | Cuándo se envió | - |
| `Respuesta` | Si respondieron | Actualizar cuando llegue respuesta |
| `Seguimiento` | Cuándo hacer follow-up | Poner fecha |

---

### **Database "📈 Estadísticas"**

| Columna | Qué es |
|---------|--------|
| `Semana` | Semana del reporte |
| `Tiendas Encontradas` | Cuántas tiendas se encontraron |
| `Emails Enviados` | Cuántos emails se enviaron |
| `Respuestas Recibidas` | Cuántas respuestas llegaron |
| `Tasa Respuesta` | Porcentaje de respuestas (automático) |

---

## 🎯 Ejemplo de Uso Real

### **Lunes 9:00 AM**

1. **Abres Notion** en tu computador o celular
2. **Vas a "📧 Emails Enviados"**
3. **Ves 20 emails nuevos** generados por Giorgio
4. **Lees 5 emails** que te parecen interesantes
5. **Marcas el checkbox** "¿Enviar?" en esos 5
6. **Sigues con tu día**

### **Lunes 9:05 AM - 9:15 AM**

- El sistema envía los 5 emails automáticamente
- Estado cambia a "✅ Enviado"
- Tú no haces nada

### **Miércoles**

1. **Abres Gmail** en `guerrerobritocarlos@gmail.com`
2. **Ves 1-2 respuestas** de tiendas interesadas
3. **Vas a Notion** → "📧 Emails Enviados"
4. **Buscas la tienda** que respondió
5. **Actualizas "Respuesta"** a "✅ Sí - Positivo"
6. **Pones fecha en "Seguimiento"** para la próxima semana

---

## ⚠️ Límites de Envío

| Límite | Valor |
|--------|-------|
| **Emails por envío** | 2 |
| **Intervalo** | 5 minutos |
| **Emails por hora** | 24 |
| **Emails por día** | 576 (máximo) |
| **Recomendado por día** | 10-20 |

**Para empezar:**
- 10-20 emails por día
- 50-100 emails por semana
- Máximo 300 emails por mes

---

## 📞 Contacto y Soporte

**Sitio Web:** https://jessvitrofusion.art/  
**Email:** guerrerobritocarlos@gmail.com  
**WhatsApp:** Jessica o Carlos

**Si hay problemas:**
- Habla con Giorgio
- Revisa `GUIA-EMAILS.md` para más detalles

---

## 🎯 Resumen Rápido

```
1. Abrir Notion              → https://www.notion.so/3344821260be81bc91d4cc5bfc0e309f
2. Ir a "📧 Emails Enviados"  → Ver emails generados
3. Leer Email Borrador       → Revisar que esté bien
4. Marcar ¿Enviar? ✅         → Aprobar envío
5. Esperar 5 minutos         → Sistema envía automáticamente
6. Revisar Gmail             → Ver respuestas
7. Actualizar Notion         → Marcar "Respuesta: ✅ Sí"
```

---

*Jess Vitrofusión - ExportaRadar*  
*Versión 2.0 - Con envío automático desde Notion*  
*Última actualización: 2026-03-31*
