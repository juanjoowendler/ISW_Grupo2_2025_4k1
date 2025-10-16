from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Actividad, Inscripcion


# Create your views here.
""" def get_actividades(request, ):
    actividades = Actividad.objects.filter()
    response.status_code = 200
    return response """

def get_actividades(request):
    tipo = request.GET.get("tipo")
    disponible = request.GET.get("disponible")

    actividades = Actividad.objects.all()

    # Filtrar por tipo si se envía
    if tipo:
        actividades = actividades.filter(tipo__iexact=tipo)

    # Filtrar por disponibilidad si se envía
    if disponible is not None:
        disponible = disponible.lower() == "true"
        actividades = [a for a in actividades if a.esta_disponible() == disponible]

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

        # Validar talle si la actividad lo requiere
        if actividad.tipo.lower() in ["tirolesa", "palestra"] and not data.get("talle"):
            return JsonResponse({"error": "Debe ingresar el talle de vestimenta"}, status=400)
        
        # Validar que el talle sea uno válido si se proporciona
        talles_validos = ["XS", "S", "M", "L", "XL", "XXL"]
        if actividad.tipo.lower() in ["tirolesa", "palestra"] and actividad.talle and data.get("talle") not in talles_validos:
            return JsonResponse({"error": "El talle proporcionado no es válido"}, status=400)

        # Crear inscripción
        inscripcion = Inscripcion.objects.create(
            id_actividad=id_actividad,
            nombre=data.get("nombre"),
            dni=data.get("DNI"),
            edad=data.get("edad"),
            cant_personas=cant,
            talle=data.get("talle")
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
