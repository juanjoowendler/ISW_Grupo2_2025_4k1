# **Festival Folklore**

 **Vender Entradas**

Existen personas que estan dispuestas a reaalizar la programacion de sus festival y la venta de entradas atraves de una plataforma web 

**Criterios de Aceptación**

- La forma de venta debe ser de contado en efectivo
- Se deben evitar entradas duplicadas
- Debe generarse en 6 segundos o menos
- Se debe aplicar descuento por venta anticipada si corresponde
- La entrada debe tener un código de barras y cumplir con ley de facturación
- Se debe controlar la concurrencia para la venta de una misma entrada

 **Pruebas de Usuario**

- Probar vender una entrada para una butaca y fecha libre (pasa)
- Probar vender una entrada ya vendida en otro punto de venta (falla)
- Probar vender una entrada por venta anticipada con descuento (pasa)
- Probar descuento por venta anticipada, pero no corresponde (falla)
- Probar imprimir entradas con código de barras (pasa)
- Probar imprimir entradas con impresora apagada (falla)
- Probar vender una entrada sin seleccionar butaca (falla)
- Probar seleccionar una butaca reservada por concurrencia (falla)

Justificación estimación US

- Incertidumbre: Nula. No hay duda técnica, la generación de código de barras y la impresión se puede hacer con librerías.
- Esfuerzo: Involucra desarrollar un control de concurrencia, varias validaciones que combinan distintos casos extremos que se deben considerar, cumplimiento de rendimiento en la impresión, y verificación de cumplimiento de la ley.
- Complejidad: Es una US compleja, es una transacción que además interacciona con una impresora y requiere manejar concurrencia

**Canónica**

Estimación: 1

Frase verbal: Registrar Grupo Musical

Justificación: La incertidumbre es nula. Las validaciones son triviales.

## **Mínimo Producto Viable**

### **US que forman parte del MVP**


- Vender Entrada
- Registrar Grupo Musical
- Diagramar Festival
- Definir Precios
- Registrar Punto de Venta
- Registrar Festival

### **Alcance y Justificación**

Aplicación que permita la venta de entradas en un punto de venta, cobrando en efectivo, sin descuentos y para un tipo de entrada general.

El responsable de festival podrá diagramar un festival para un único predio con estructura fija y podrá registrar los grupos musicales

No se incluye:

- Descuentos por venta anticipada
- Reportes
- Configuración del predio