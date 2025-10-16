from django.urls import path
from . import views

urlpatterns = [
    path("actividades", views.get_actividades, name="get_actividades"),
    path("inscripciones_actividades", views.post_inscripcion, name="post_inscripcion"),
]