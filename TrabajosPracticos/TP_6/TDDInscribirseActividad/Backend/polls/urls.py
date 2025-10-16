from django.urls import path
from . import views

urlpatterns = [
    path("actividades", views.get_actividades, name="get_actividades"),
    path("inscripcion", views.post_inscripcion, name="post_inscripcion"),
]