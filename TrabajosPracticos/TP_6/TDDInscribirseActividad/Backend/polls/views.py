from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Actividad, Inscripcion


# Create your views here.
def get_actividades(request):
    response = HttpResponse([f"{a}\n\n" for a in Actividad.objects.all()])
    response.status_code = 200
    return response


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
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Buscar la actividad por ID
            id_actividad = data.get('id_actividad')
            try:
                actividad = Actividad.objects.get(id=id_actividad)
            except Actividad.DoesNotExist:
                return JsonResponse({"error": "La actividad no existe"}, status=404)

            # Verificar cupo disponible
            if actividad.cupo_disponible <= 0:
                return JsonResponse({"error": "No hay cupos disponibles"}, status=400)

            # Crear la inscripción
            inscripcion = Inscripcion.objects.create(
                id_actividad=id_actividad,
                nombre=data.get('nombre'),
                dni=data.get('dni'),
                edad=data.get('edad'),
                cant_personas=data.get('cant_personas'),
                talle=data.get('talle')
            )

            # Actualizar cupo de la actividad
            actividad.cupo_disponible -= inscripcion.cant_personas
            actividad.save()

            return JsonResponse({
                "mensaje": "Inscripción registrada correctamente",
                "id_inscripcion": inscripcion.id,
                "actividad": actividad.tipo,
                "cupo_restante": actividad.cupo_disponible
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)
