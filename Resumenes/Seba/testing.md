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

## Error ≠ Defecto

Ambos son fallas en un producto de software, pero su clasificación depende del momento en el que se encuentran o producen.

- El **error** se da durante el proceso de desarrollo, en la etapa de implementación. Es conveniente encontrar errores en lugar de defectos, debido a su bajo costo de corrección.
- El **defecto** es un error que se trasladó a una etapa posterior, como de producción o pruebas finales. Es más caro que un error. El testing busca encontrar **defectos**.

Los defectos se clasifican según su **severidad** y según su **prioridad**.

- Severidad: Bloqueante, crítico, mayor, menor o cosmético.
- Prioridad: Urgencia, alta, media, baja.

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