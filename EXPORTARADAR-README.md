# 🌍 ExportaRadar - Sistema para Encontrar Clientes en el Extranjero

> **Tu puente para vender al mundo** 🌉

---

## 👋 ¡Bienvenidos!

Este sistema les ayuda a **encontrar tiendas en Europa** que puedan comprar sus productos de vitrofusión.

**Es muy simple de usar:**
1. El sistema busca tiendas automáticamente
2. Prepara emails en el idioma de cada país
3. Ustedes solo revisan y envían
4. ¡Esperan las respuestas!

---

## 📱 ¿Cómo Se Usa?

### **Paso 1: Buscar Tiendas**

En tu computador, abre la terminal y escribe:

```bash
npm run exporta:buscar
```

**¿Qué hace?**
- Busca 100 joyerías en España, Alemania, Francia, Italia y Reino Unido
- Guarda los resultados automáticamente
- Tarda unos 2-3 minutos

**Verás algo así:**
```
🔍 Buscando joyerías en España...
  ✅ España: 20 joyerías encontradas
🔍 Buscando joyerías en Alemania...
  ✅ Alemania: 20 joyerías encontradas
...
💾 Resultados guardados en: joyerias-europa-2026-03-31.json
📊 Total: 100 joyerías encontradas
```

---

### **Paso 2: Generar Emails**

Una vez que tienes las tiendas, genera los emails:

```bash
npm run exporta:emails
```

**¿Qué hace?**
- Lee la lista de joyerías
- Crea un email personalizado para cada una
- Lo escribe en el idioma del país (español, alemán, francés, etc.)
- Genera una vista previa fácil de leer

**Verás algo así:**
```
========================================
  Generación de Emails Personalizados
========================================

✅ 100 emails generados

📊 Por país:
  España: 20
  Alemania: 20
  Francia: 20
  Italia: 20
  Reino Unido: 20

💾 Emails guardados en: emails-europa-2026-03-31.json
🌐 Vista previa HTML: preview-emails-2026-03-31.html
```

---

### **Paso 3: Revisar y Enviar**

1. **Abre el archivo HTML** que se creó (está en la carpeta `data/`)
2. **Revisa los emails** - se ven como se verían cuando los envíes
3. **Copia el email** que quieras enviar (hay un botón "📋 Copiar Email")
4. **Pega en tu email** (Gmail, Outlook, etc.)
5. **¡Envía!**

**Consejo:** Revisa 10-20 emails al día y envíalos poco a poco.

---

## 🎯 Dashboard en Notion

También tienen un **dashboard en Notion** donde pueden ver:

- 📊 Cuántas tiendas encontraron
- ✅ Cuántos emails enviaron
- 💬 Cuántas respuestas recibieron
- 📍 Tiendas por país

**Link:** [Tu Dashboard de Notion](https://www.notion.so/)

(El link se los comparte Giorgio cuando lo configure)

---

## 📝 Consejos Importantes

### ✅ Para Tener Éxito

1. **Personaliza el email:**
   - Donde dice `[TU NOMBRE]`, pon tu nombre real
   - Donde dice `[NOMBRE EMPRENDIMIENTO]`, pon el nombre de su negocio
   - Agrega su Instagram o website si tienen

2. **Envía poco a poco:**
   - 10-20 emails por día está bien
   - Mejor calidad que cantidad

3. **Sigue las respuestas:**
   - Si alguien responde, contesta rápido (mismo día si es posible)
   - Usa el dashboard para trackear quién respondió

4. **No te desanimes:**
   - De cada 10 emails, 1-2 van a responder
   - ¡Es normal! Es un número bueno

---

## 🆘 ¿Tienen Problemas?

### "No encuentro el archivo HTML"
- Está en la carpeta `data/` dentro del proyecto
- Se llama algo como `preview-emails-2026-03-31.html`
- Ábrelo con Chrome o Edge

### "Los emails se ven raros"
- Revisa que los datos del emprendimiento estén correctos
- Habla con Giorgio para que los actualice en el sistema

### "No me llega ninguna respuesta"
- Es normal los primeros días
- Las tiendas reciben muchos emails
- Sigue enviando, ¡las respuestas llegan!

---

## 📞 Contacto

Si tienen dudas o necesitan ayuda:

- **Email:** guerrerobritocarlos@gmail.com
- **WhatsApp:** [Tu número aquí]
- **Giorgio:** [Contacto de Giorgio]

---

## 🚀 Próximos Pasos

Una vez que dominen esto:

1. **Podemos buscar más países** (Países Bajos, Bélgica, Portugal, etc.)
2. **Podemos buscar otros rubros** (no solo joyerías)
3. **Podemos automatizar más** (que los emails se envíen solos)

---

*ExportaRadar - Tu puente al mundo* 🌍  
*Versión 1.0 - Marzo 2026*
