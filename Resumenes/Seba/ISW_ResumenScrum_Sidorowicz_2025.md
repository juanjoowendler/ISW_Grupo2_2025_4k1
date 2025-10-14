Breve resumen en base a:
[2020-Scrum-Guide-Spanish-Latin-South-American.pdf](https://github.com/SebastianSidorowicz/ISW_Grupo2_2025_4k1/blob/main/MaterialClases/MaterialesAdicionales/2020-Scrum-Guide-Spanish-Latin-South-American.pdf)


Esta guía define Scrum, un marco de trabajo liviano para generar valor mediante soluciones adaptativas para problemas complejos. Scrum se basa en el empirismo y el pensamiento Lean, empleando un enfoque iterativo e incremental.

El marco de trabajo Scrum es inmutable y solo existe en su totalidad.

Scrum requiere un Scrum Master que fomente un entorno donde:

1. Un Product Owner ordena el trabajo en un Product Backlog.
2. El Scrum Team convierte una selección del trabajo en un Increment durante un Sprint.
3. El Scrum Team y los interesados inspeccionan los resultados y se adaptan para el próximo Sprint.
4. Se repite el proceso.

## Teoría de Scrum

Scrum se fundamenta en la *transparencia, inspección y adaptación*. La transparencia permite la inspección, que a su vez posibilita la adaptación.

## Valores de Scrum

El éxito de Scrum depende de que las personas se vuelvan más competentes en cinco valores: Compromiso, Foco, Franqueza, Respeto y Coraje.

## Scrum Team

El Scrum Team consta de un Scrum Master, un Product Owner y Developers. Es multifuncional, autogestionado y típicamente de 10 personas o menos.

### Developers

Los Developers se comprometen a:

- Crear un plan para el Sprint (Sprint Backlog)
- Inculcar calidad adhiriéndose a la Definición de Terminado
- Adaptar su plan diariamente hacia el Objetivo del Sprint
- Responsabilizarse mutuamente como profesionales

### Product Owner

El Product Owner maximiza el valor del producto y gestiona eficazmente el Product Backlog:

- Desarrolla y comunica el Objetivo del Producto
- Crea y comunica los elementos del Product Backlog
- Ordena los elementos del Product Backlog
- Asegura que el Product Backlog sea transparente y entendible

### Scrum Master

El Scrum Master establece Scrum como se define en la Guía de Scrum:

- Guía al equipo en la autogestión y multifuncionalidad
- Ayuda a enfocarse en crear Increments de alto valor
- Elimina impedimentos al progreso del equipo
- Asegura que los eventos de Scrum ocurran y sean productivos

## Eventos de Scrum

### El Sprint

Los Sprints son el corazón de Scrum, donde las ideas se convierten en valor. Tienen una duración fija de un mes o menos.

### Sprint Planning

La Sprint Planning inicia el Sprint estableciendo el trabajo a realizar. Aborda tres temas:

- Por qué este Sprint es valioso (Objetivo del Sprint)
- Qué se puede hacer en este Sprint
- Cómo se realizará el trabajo elegido

### Daily Scrum

La Daily Scrum es un evento de 15 minutos para los Developers con el fin de inspeccionar el progreso hacia el Objetivo del Sprint y adaptar el Sprint Backlog. Ayer: qué hicimos, dificultades. Hoy: que vamos a hacer

### Sprint Review

El propósito de la Sprint Review es inspeccionar el resultado del Sprint y determinar futuras adaptaciones. El Scrum Team presenta los resultados a los interesados clave y se discute el progreso hacia el Objetivo del Producto.

Básicamente le muestra el producto al PO.

Definition of Done: identificar si cada US que voy a agregar cumple con las condiciones que dijimos que tiene que cumplir.

### Sprint Retrospective

La Sprint Retrospective planifica formas de aumentar la calidad y la efectividad. El Scrum Team inspecciona el último Sprint y identifica mejoras para implementar en el próximo Sprint.

Usar técnicas que despersonalicen la inspección. Poder elegir acciones puntuales para corregir aquello que se hizo mal.

## Artefactos de Scrum

### Product Backlog

El Product Backlog es una lista emergente y ordenada de lo que se necesita para mejorar el producto. Es la única fuente del trabajo para el Scrum Team.

Compromiso: Objetivo del Producto

El Objetivo del Producto describe un estado futuro del producto y sirve como meta para que el Scrum Team planifique.

### Sprint Backlog

El Sprint Backlog se compone del Objetivo del Sprint, los elementos del Product Backlog seleccionados y un plan para entregar el Increment.

Compromiso: Objetivo del Sprint
El Objetivo del Sprint es el único propósito del Sprint y proporciona flexibilidad en términos del trabajo exacto necesario para lograrlo.

### Increment

Un Increment es un paso concreto hacia el Objetivo del Producto. Cada Increment se suma a todos los Increments anteriores y se verifica minuciosamente.

Compromiso: Definición de Terminado (Definition of Done)
La Definición de Terminado es una descripción formal del estado del Increment cuando cumple con las medidas de calidad requeridas para el producto.

# Definiciones importantes

###  Definición de Hecho (**𝑫𝑶𝑵𝑬**)
---
Es una definición propia del equipo, que se valida con un **checklist** donde se especifican todas las características que debe tener una **User Story (US)** para considerarse **decentemente terminada** y presentársela al **Product Owner (PO)**.  
Debe cumplir con los siguientes criterios:

-  **Pruebas unitarias y de aceptación en verde**.  
-  **Pasar el ambiente de prueba**.

---

###  Definición de Listo (**𝑹𝑬𝑨𝑫𝒀**)
---

Permite definir qué debe cumplir una **US** para asegurarnos de que está lista para ser implementada.  
Es una definición **acordada por el equipo**, a partir de la cual se arma un **checklist** para determinar si la US cumple con los aspectos pactados.

- Si cumple con **todos los criterios**, puede ser incluida en un sprint.  
- Si **no cumple** con alguno, se debe trabajar más en esa US antes de incluirla.

---

##  Spike

Tipo especial de **US** que sirve para **quitar riesgo o incertidumbre** de otro requerimiento, de otra US o de alguna faceta del proyecto que se quiere investigar. Son creadas **específicamente para este fin**.

###  Spike Técnica
Utilizadas para **investigar enfoques técnicos** en el dominio de la solución.  
Se aplican cuando el equipo necesita una **comprensión más fiable** sobre alguna tecnología antes de comprometerse a desarrollar una nueva funcionalidad en un tiempo fijo.

###  Spike Funcional
Utilizadas cuando hay **incertidumbre respecto a cómo el usuario interactuará** con el sistema.  
Generalmente se evalúan con **prototipos** para obtener retroalimentación de los usuarios o involucrados.

 Normalmente se trabajan **un sprint antes** del sprint donde se implementará la US que tiene incertidumbre.  
Los **spikes** deben ser:

-  **Demostrables**  
- **Estimables**  
-  **Aceptables**  

Cumpliendo el criterio de **𝑹𝑬𝑨𝑫𝒀**.

> ⚠️ **El spike es una excepción**, no siempre se debe aplicar; es la **última opción**.  
> Antes de implementarlo, se gestiona todo dentro de la misma US.


