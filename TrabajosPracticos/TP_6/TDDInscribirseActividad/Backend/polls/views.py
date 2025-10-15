from django.http import HttpResponse

actividades = [{
        "id_actividad":1,
        "tipo":"Palestra",
        "hora":"16:30",
        "inscriptos":4,
    },{
        "id_actividad":2,
        "tipo":"Safari",
        "hora":"14:30",
        "inscriptos":7
    },{
        "id_actividad":3,
        "tipo":"Tirolesa",
        "hora":"16:00",
        "inscriptos":0
        }]

# Create your views here.
def get_actividades(request):
    response = HttpResponse(actividades)
    response.status_code = 200
    return response