from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Actividad, Inscripcion, Persona, InscripcionPorPersona


# Create your views here.
""" def get_actividades(request, ):
    actividades = Actividad.objects.filter()
    response.status_code = 200
    return response """

def get_actividades(request):
    tipo = request.GET.get("tipo")
    disponible = request.GET.get("disponible")
    hora = request.GET.get("hora")
    dia = request.GET.get("dia")
    
    actividades = Actividad.objects.all()

    # Filtrar por tipo si se envía
    if tipo:
        actividades = actividades.filter(tipo__iexact=tipo)

    # Filtrar por disponibilidad si se envía
    if disponible is not None:
        disponible = disponible.lower() == "true"
        actividades = [a for a in actividades if a.esta_disponible() == disponible]
    
    # Filtrar por hora si se envía
    if hora:
        actividades = [a for a in actividades if a.hora.strftime("%H:%M") >= hora]
    
    # Filtra por día si se envia
    if dia:
        # Si 'actividades' es un QuerySet usamos .filter, si ya es una lista (por filtros anteriores) usamos una comprensión.
        if hasattr(actividades, "filter"):
            actividades = actividades.filter(fecha=dia)
        else:
            # Soportar tanto formatos 'YYYY-MM-DD' como 'DD-MM-YYYY' en el parámetro dia
            actividades = [
                a for a in actividades
                if a.fecha.strftime("%Y-%m-%d") == dia or a.fecha.strftime("%d-%m-%Y") == dia
            ]
            
    if not actividades:
        return JsonResponse({"mensaje": "No se encontraron actividades."}, status=404)

    data = [
        {
            "id_actividad": a.id,
            "tipo": a.tipo,
            "descripcion": a.descripcion,
            "fecha": a.fecha.strftime("%Y-%m-%d"),
            "hora": a.hora.strftime("%H:%M"),
            "cupo_disponible": a.cupo_disponible
        }
        for a in actividades
    ]

    return JsonResponse(data, safe=False, status=200)

# id, idact, nombre, dni, edad, cant_personas, talle

#POST

# {
#   "id_actividad": 2,
#   "nombre": "Emanuel Scrosati",
#   "dni": 45074602,
#   "edad": 22,
#   "cant_personas": 1,
#   "terminosYcondiciones": true
# }


@csrf_exempt
def post_inscripcion(request):    
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)

        # Buscar la actividad
        id_actividad = data.get('id_actividad')
        try:
            actividad = Actividad.objects.get(id=id_actividad)
        except Actividad.DoesNotExist:
            return JsonResponse({"error": "La actividad no existe"}, status=404)

        # Validar términos
        terminos = data.get("terminosYcondiciones", None)
        if not isinstance(terminos, bool) or terminos is not True:
            return JsonResponse({"error": "Debe aceptar los términos y condiciones"}, status=400)

        # Validar disponibilidad
        if not actividad.esta_disponible():
            return JsonResponse({"error": "La actividad no está disponible"}, status=400)

        # Validar cupos
        cant = int(data.get("cant_personas", 0))
        if actividad.cupo_disponible < cant or cant <= 0:
            return JsonResponse({"error": "No hay cupos disponibles"}, status=400)
        
        personas = data.get("personas", [])

        edad_minima = 0
        for p in personas:
            dni=p.get("dni")
            nombre=p.get("nombre")
            edad = p.get("edad")
            talle=p.get("talle")

            # Validar campos mínimos
            if not dni or not nombre or not edad:
                return JsonResponse({"error": f"Faltan datos para una una persona ({persona_data})"}, status=400)
            try:
                dni=int(dni)
            except:
                return JsonResponse({"error": "El DNI debe ser un entero"})
            if not (1000000 <= dni <= 100000000):
                return JsonResponse({"error": "El DNI debe ser un entrero entre 1.000.000 y 100.000.000"}, status=400)
            
            # Validar el talle si ess que corresponde en base a la actividad.
            if actividad.tipo.lower() in ["tirolesa", "palestra"]:
                if not talle:
                    return JsonResponse({"error": f"Debe ingresar el talle para: {nombre}"}, status=400)
                if talle not in ["XS", "S", "M", "L", "XL", "XXL"]:
                    return JsonResponse({"error": f"El talle '{talle}' no es válido"}, status=400)
                edad_minima = 12 if actividad.tipo.lower() == 'palestra' else 8
                

            # Validar edad mínima si corresponde
            if actividad.tipo.lower() in ["tirolesa", "palestra"] and edad_minima > 0 and edad < edad_minima:
                return JsonResponse({
                    "error": f"La edad mínima para inscribirse en {actividad.tipo} es de {edad_minima} años. "
                }, status=400)
                            
    
        
        # if actividad.tipo.lower() in ["tirolesa", "palestra"] and edad_minima > 0:
        #     return JsonResponse({"error": f"La edad minima para inscribirse en {actividad.tipo} es de {edad_minima} años"}, status=400)
        
        # Crear inscripción
        inscripcion = Inscripcion.objects.create(
            id_actividad=id_actividad,
            cant_personas=cant
        )
        
        for persona_data in personas:
            dni=persona_data.get("dni")
            nombre=persona_data.get("nombre")
            edad = persona_data.get("edad")
            talle=persona_data.get("talle")
            
            persona, _ = Persona.objects.get_or_create(
                dni=dni,
                defaults={"nombre": nombre, "edad": edad, "talle": talle}
            )

            InscripcionPorPersona.objects.create(
                persona=persona,
                inscripcion=inscripcion
            )

        # Actualizar cupo
        actividad.cupo_disponible -= cant
        actividad.save()

        return JsonResponse({
            "mensaje": "Inscripción registrada correctamente",
            "id_inscripcion": inscripcion.id,
            "actividad": actividad.tipo,
            "cupo_restante": actividad.cupo_disponible
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
