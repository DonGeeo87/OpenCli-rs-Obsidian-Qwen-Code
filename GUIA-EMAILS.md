# 📧 Guía de Envío de Emails - Jess Vitrofusión

> **Cómo enviar emails automáticamente con aprobación desde Notion**

**Sitio Web:** https://jessvitrofusion.art/  
**Email:** guerrerobritocarlos@gmail.com  
**WhatsApp:** Jessica o Carlos disponibles para cotizar

---

## 🎯 Flujo Completo (Paso a Paso)

### **Paso 1: Buscar Tiendas**

```bash
npm run exporta:buscar
```

**Resultado:**
- 100 tiendas encontradas en Europa
- Guardadas en `data/joyerias-europa-*.json`

---

### **Paso 2: Cargar Tiendas a Notion** (Próximamente)

*Esta funcionalidad estará disponible pronto. Por ahora, las tiendas se cargan manualmente.*

---

### **Paso 3: Generar Emails en Notion**

```bash
npm run exporta:sync
```

**Qué hace:**
- Lee tiendas desde Notion
- Genera emails personalizados por país
- Crea entradas en "📧 Emails Enviados"
- **NO envía automáticamente** (solo crea borradores)

---

### **Paso 4: Revisar Emails en Notion**

1. **Abre Notion** → Dashboard ExportaRadar
2. **Ve a la database** "📧 Emails Enviados"
3. **Revisa los emails** en la columna "Email Borrador"

**Qué debes fijarte:**
- ✅ Nombre de la tienda está correcto
- ✅ Email del destinatario es válido
- ✅ El texto del email está bien escrito
- ✅ Tus datos (nombre, emprendimiento, WhatsApp) están correctos

---

### **Paso 5: Aprobar Email para Envío** ⭐

**Cuando un email está bien:**

1. **Marca el checkbox** "¿Enviar?" ✅
2. **El sistema detectará** el checkbox marcado
3. **Enviará automáticamente** en los próximos 5 minutos

**Estados del email:**

| Estado | Significado |
|--------|-------------|
| ⏳ Pendiente | Email creado, esperando aprobación |
| ✅ Enviado | Email enviado exitosamente |
| ❌ Error | Error al enviar (revisar notas) |

---

### **Paso 6: Envío Automático** 🚀

**El sistema:**
- Revisa emails **cada 5 minutos**
- Envía **2 emails por vez** (para no ser spam)
- Actualiza el estado a "✅ Enviado"
- Registra la fecha y hora de envío

**No tienes que hacer nada** después de marcar el checkbox.

---

## 📊 Dashboard en Notion

### Database "📧 Emails Enviados"

| Columna | Qué es | Qué haces tú |
|---------|--------|--------------|
| `Tienda` | Nombre de la tienda | - |
| `País` | País de la tienda | - |
| `Email Tienda` | Email del destinatario | Verificar que esté bien |
| `Email Borrador` | Email generado para revisar | **LEER ANTES DE ENVIAR** |
| `¿Enviar?` | Checkbox para aprobar | **MARCAR cuando está bien** ✅ |
| `Estado` | Estado del envío | - |
| `Fecha Envío` | Cuándo se envió | - |
| `Respuesta` | Si respondieron o no | Actualizar cuando llegue respuesta |
| `Seguimiento` | Cuándo hacer follow-up | Poner fecha si es necesario |
| `Notas` | Notas del envío | - |

---

## 🎯 Ejemplo de Uso Real

### **Martes 9:00 AM - Revisión Matutina**

1. **Abres Notion** en tu computador o celular
2. **Vas a "📧 Emails Enviados"**
3. **Ves 20 emails nuevos** generados automáticamente
4. **Lees 5 emails** que te parecen interesantes
5. **Marcas el checkbox** "¿Enviar?" en esos 5
6. **Sigues con tu día**

### **Martes 9:05 AM - Primer Envío Automático**

- El sistema detecta los 5 emails aprobados
- Envía los primeros 2 (límite por ejecución)
- Estado cambia a "✅ Enviado"
- Fecha de envío se registra

### **Martes 9:10 AM - Segundo Envío Automático**

- El sistema envía otros 2 emails
- Estado cambia a "✅ Enviado"

### **Martes 9:15 AM - Tercer Envío Automático**

- El sistema envía el último email
- ¡Listo! 5 emails enviados automáticamente

### **Miércoles - Llegan Respuestas**

1. **Abres Gmail** en `guerrerobritocarlos@gmail.com`
2. **Ves 1-2 respuestas** de tiendas interesadas
3. **Vas a Notion** → "📧 Emails Enviados"
4. **Buscas la tienda** que respondió
5. **Actualizas "Respuesta"** a "✅ Sí - Positivo"
6. **Pones fecha en "Seguimiento"** para la próxima semana

---

## ⚠️ Límites de Envío

### Configuración Actual

| Límite | Valor |
|--------|-------|
| **Emails por envío** | 2 |
| **Intervalo** | 5 minutos |
| **Emails por hora** | 24 |
| **Emails por día** | 576 |
| **Límite Resend Free** | 100/día, 3000/mes |

### Recomendado

**Para empezar:**
- 10-20 emails por día
- 50-100 emails por semana
- Máximo 300 emails por mes

**¿Por qué?**
- Mejor calidad que cantidad
- Evitar caer en spam
- Poder trackear cada respuesta

---

## 🔧 Configuración de Emails

### ¿Desde qué email se envían?

**Email From:** `guerrerobritocarlos@gmail.com`

**Email CC (copia):** `chicjessy@gmail.com`

**Reply-To:** `guerrerobritocarlos@gmail.com`

**Todas las respuestas llegan a:** `guerrerobritocarlos@gmail.com`

---

### ¿Cómo cambiar los datos del emprendimiento?

**Archivo:** `config/exportaradar.js`

```javascript
module.exports = {
  nombreContacto: 'Carlos Guerrero',  // ← Tu nombre
  nombreEmprendimiento: 'VitroArte Chile',  // ← Tu negocio
  email: 'guerrerobritocarlos@gmail.com',
  whatsapp: '+569XXXXXXXX',  // ← Tu WhatsApp
  website: 'https://instagram.com/tu_emprendimiento'  // ← Tu Instagram
};
```

---

## 🚨 Solución de Problemas

### "Los emails no se envían"

**Verifica:**
1. ¿Marcaste el checkbox "¿Enviar?"?
2. ¿El cron job está corriendo? (`npm run exporta:cron`)
3. ¿Hay conexión a internet?

**Revisa:**
- Columna "Estado" → ¿Dice "❌ Error"?
- Columna "Notas" → ¿Hay algún mensaje de error?

**Solución:**
```bash
# Ejecutar envío manual
npm run exporta:send

# Ver errores en consola
```

---

### "Los emails llegan a Spam"

**Posibles causas:**
- Muchos emails en poco tiempo
- Contenido muy genérico
- Dominio no verificado

**Solución:**
- Enviar menos emails (10-20 por día)
- Personalizar más cada email
- Verificar dominio en Resend (próximamente)

---

### "No veo los emails en Notion"

**Verifica:**
1. ¿Ejecutaste `npm run exporta:sync`?
2. ¿Las databases están bien configuradas?
3. ¿La API key de Notion es correcta?

**Solución:**
```bash
# Regenerar emails
npm run exporta:sync

# Ver logs en consola
```

---

## 📞 Soporte

**¿Problemas o dudas?**

- Email: guerrerobritocarlos@gmail.com
- WhatsApp: [Tu número]
- GitHub: [Issues del repositorio](https://github.com/DonGeeo87/OpenCli-rs-Obsidian-Qwen-Code/issues)

---

## 🎯 Resumen Rápido

```
1. npm run exporta:sync      → Genera emails en Notion
2. Abrir Notion              → Ver emails en "📧 Emails Enviados"
3. Leer Email Borrador       → Revisar que esté bien
4. Marcar ¿Enviar? ✅         → Aprobar envío
5. Esperar 5 minutos         → Sistema envía automáticamente
6. Revisar Gmail             → Ver respuestas
```

---

*ExportaRadar - Envío Automático de Emails*  
*Versión 2.0 - Con aprobación desde Notion*  
*Última actualización: 2026-03-31*
