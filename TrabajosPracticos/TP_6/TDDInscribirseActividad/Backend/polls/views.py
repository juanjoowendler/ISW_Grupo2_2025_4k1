from django.http import HttpResponse
from .models import Actividad, Inscripcion

# Create your views here.
def get_actividades(request):
    response = HttpResponse([f"{a}\n\n" for a in Actividad.objects.all()])
    response.status_code = 200
    return response