# archivo: C:\DonGeeo87\asistente.py
import os
from datetime import datetime

VAULT_PATH = r"C:\DonGeeo87"

def crear_nota_diaria():
    """Crea nota automática con fecha"""
    fecha = datetime.now().strftime("%Y-%m-%d")
    nota_path = os.path.join(VAULT_PATH, f"Daily-{fecha}.md")
    
    contenido = f"""# {fecha}

## Tareas
- [ ] 

## Notas
- 

## IA Actions
- 
"""
    with open(nota_path, "w", encoding="utf-8") as f:
        f.write(contenido)
    
    print(f"✓ Nota creada: {nota_path}")

if __name__ == "__main__":
    crear_nota_diaria()