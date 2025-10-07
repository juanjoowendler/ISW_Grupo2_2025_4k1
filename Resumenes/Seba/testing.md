# Testing de Software

El testing está en el contexto del aseguramiento de calidad (QA). La prueba de software no incluye a control de calidad de proceso ni de calidad de producto.

El testing es un proceso **destructivo** cuyo **objetivo es el de encontrar defectos**. Se asume la presencia de defectos. Mundialmente, este proceso representa el 30-50% del costo de un software confiable.

El costo de corregir un error aumenta exponencialmente en el tiempo.

Es necesario por distintos motivos:

- La existencia de defectos en el software es inevitable.
- Se evitan demandas de clientes
- Se reducen riesgos
- Se construye confianza en el producto
- Las fallas son muy costosas
- Para verificar que el software se ajusta a los requerimientos y validar que las funciones se implementan correctamente.

**Asegurar Calidad ≠ Controlar Calidad**

Una vez definidos los requerimientos de calidad, se debe tener en cuenta que la calidad no se puede inyectar al final, y que la calidad depende de tareas realizadas durante todo el proceso. Detectar errores ahorra recursos. El testing **no puede asegurar ni calidad en el software ni software de calidad**. 

Sigue los siguientes principios:

- El testing muestra presencia de defecto.
- El testing exhaustivo es imposible
- Testing temprano
- Agrupamiento de Defectos
- Paradoja del Pesticida
- El testing es dependiente del contexto
- Falacia de la ausencia de errores (se asume la presencia de errores)
- Un programador debería evitar probar su propio código.
- Una unidad de programación no debería probar sus propios desarrollos.
- Examinar el software para probar que no hace lo que se supone que debería hacer es la mitad de la batalla, la otra mitad es ver que hace lo que no se supone que debería hacer.
- No planificar el esfuerzo de testing sobre la suposición de
que no se van a encontrar defectos.

## ERROR vs DEFECTO

- El error se descubre a partir de técnicas específicas que me permiten encontrar los mismos dentro de la misma etapa en la que estoy trabajando.  
- Los defectos nos demuestran un error no detectado que se trasladó a una etapa siguiente.  

En el testing encontramos defectos, ya que justamente se encuentran cosas incorrectas que se realizaron en la etapa de implementación que es la etapa anterior.  
Más adelante en el contexto de revisiones técnicas e inspecciones vamos a ver más a fondo que son los errores y como encontrarlos.  

Obviamente siempre es mejor encontrar errores antes que defectos.  

---

## SEVERIDAD y PRIORIDAD

Cuando hablamos de defectos encontrados durante el testing, debemos considerar dos aspectos:

### SEVERIDAD
Tiene que ver con la gravedad del defecto que encontré.  
Un defecto puede ser bloqueante y no permitirme seguir con el caso de prueba, crítico, o menor, hasta **cosmético** (sintaxis, ortografía, visualización, etc.).

### PRIORIDAD
Urgencia que tenemos para resolver este defecto.  
Aunque podría intuirse que según la severidad habrá tal o cual prioridad, esto no siempre es así.  
Depende del contexto en el cual nos encontramos, por eso es importante tener los dos aspectos identificados.


## Niveles de Testing

Existen 4 niveles principales: (aunque también existe el adHoc Testing)

- Testing unitario o pruebas unitarias
- Pruebas de integración
- Pruebas de sistema
- Pruebas de aceptación

Además, existen 4 ambientes de prueba:

- Desarrollo: testing unitario
- Prueba: testing unitario y de integración
- Pre - Producción: pruebas de sistema y a veces de aceptación
- Producción: pruebas de aceptación

### Testing Unitario

- Se prueba cada componente tras su realización/construcción.
- Solo se prueban componentes individuales.
- Se encuentran errores en lugar de defectos.
- Cada componente es probado de forma independiente
- Se produce con acceso al código bajo pruebas y con el apoyo del entorno de desarrollo, tales como un framework de pruebas unitarias o herramientas de depuración.
- Los errores se suelen reparar tan pronto como se encuentran, sin constancia oficial de los incidentes.
- A diferencia de las demás pruebas, lo realizan los desarrolladores. Suelen estar automatizadas.

Ejemplo en Python: 

```python
import unittest

def sum(a, b):
    return a + b

class TestSum(unittest.TestCase):
    def test_sum(self):
        self.assertEqual(sum(5, 3), 8)
        self.assertEqual(sum(-1, 1), 0)

if __name__ == '__main__':
    unittest.main()
```
### Testing de Integración

- Test orientado a verificar que las partes de un sistema que funcionan bien aisladamente (o sea, pasaron por el testing unitario correctamente), también lo hacen en conjunto.
- Cualquier estrategia de prueba de versión o de integración debe ser incremental, para lo que existen dos esquemas principales:
- Integración de arriba hacia abajo (top-down)
- Integración de abajo hacia arriba (bottom-up).
- Lo ideal es una combinación de ambos esquemas.
- Tener en cuenta que los módulos críticos deben ser probados lo más tempranamente posible.
- Los puntos clave del test de integración son simples:
- Conectar de a poco las partes más complejas
- Minimizar la necesidad de programas auxiliares

### Testing de Sistema

- Es la prueba realizada cuando una aplicación esta funcionando como un todo (Prueba de la construcción Final).
- Trata de determinar si el sistema en su globalidad opera satisfactoriamente (recuperación de fallas, seguridad y protección, stress, performance, etc.)
- El entorno de prueba debe corresponder al entorno de producción tanto como sea posible para reducir al mínimo el riesgo de incidentes debidos al ambiente específicamente y que no se encontraron en las pruebas.
- Deben investigar tanto requerimientos funcionales y no funcionales del sistema.

### Testing de Aceptación

- Es la prueba realizada por el usuario para determinar si la aplicación se ajusta a sus necesidades.
- La meta en las pruebas de aceptación es el de establecer confianza en el sistema, las partes del sistema o las características específicas y no funcionales del sistema.
- Encontrar defectos no es el foco principal en las pruebas de aceptación.
- Comprende tanto la prueba realizada por el usuario en ambiente de laboratorio (pruebas alfa), como la prueba en ambientes de trabajo reales (pruebas beta).


## AMBIENTES PARA CONSTRUCCIÓN DEL SOFTWARE

Los ambientes son los lugares donde se trabaja para el desarrollo de software.  
Cada ambiente cumple un propósito específico.

### AMBIENTE DE DESARROLLO
El ambiente de desarrollo es donde los desarrolladores crean, prueban y depuran el software. Es un entorno
local o en red utilizado por los desarrolladores para escribir y probar el código antes de integrarlo con el resto
del sistema. Los programadores pueden utilizar herramientas de desarrollo, depuración y pruebas para
garantizar que el software cumpla con los requisitos establecidos. Este ambiente suele ser flexible y permite a
los desarrolladores experimentar y probar nuevas ideas sin afectar los entornos de producción. 
**Las pruebas unitarias se llevan a cabo en el ambiente de desarrollo**

### AMBIENTE DE PRUEBA
El ambiente de pruebas es donde se llevan a cabo pruebas exhaustivas del software desarrollado. **Aquí se realizan pruebas de integración, pruebas funcionales, pruebas de rendimiento** y otras pruebas relevantes para
verificar que el software cumpla con los requisitos establecidos y funcione correctamente. El ambiente de
prueba suele ser una réplica o tener características parecidas al entorno de producción, pero sin afectar a los
usuarios finales y sin TODAS las características (ya que es caro tener ambientes iguales al de producción). Se
utilizan conjuntos de datos y configuraciones similares a las del entorno de producción para garantizar una
prueba más precisa del software. **Las pruebas de integración se realizan en el ambiente de pruebas**

### AMBIENTE DE PRE-PRODUCCIÓN
El ambiente de preproducción, también conocido como entorno de puesta en escena o entorno de calidad, es
donde se realiza una prueba final del software antes de su lanzamiento en producción. **Aquí se simulan las condiciones del entorno de producción y se realizan pruebas de último minuto, como pruebas de estrés,pruebas de carga y pruebas de seguridad**. El objetivo es validar y verificar que el software esté listo para ser implementado en el entorno de producción sin problemas significativos. **Las pruebas de sistema se llevan a cabo en el ambiente de preproducción**


### AMBIENTE DE PRODUCCIÓN

El ambiente de producción es donde el software está en funcionamiento y es accesible a los usuarios finales.
Es el entorno real en el que el software se utiliza para realizar las tareas y funciones para las que fue diseñado.
Este ambiente suele ser altamente controlado y está configurado para ser escalable, seguro y confiable. Se
implementan medidas de respaldo y recuperación ante desastres para garantizar la disponibilidad continua del
software. Es el ambiente en el que el software está funcionando. **Las pruebas de aceptación se llevan a cabo en el ambiente de preproducción o en un entorno similar al de producción (en el ambiente de prueba)**

---


