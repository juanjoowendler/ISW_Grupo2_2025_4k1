from django.db import models

# Create your models here.

class Inscripcion(models.Model):
    id = models.AutoField(primary_key=True)
    id_actividad = models.IntegerField()
    nombre = models.CharField(max_length=100)
    dni = models.IntegerField()
    edad = models.IntegerField()
    cant_personas = models.IntegerField()
    talle = models.CharField(max_length=10, blank=True, null=True)
    terminosYcondiciones = models.BooleanField()

    def __str__(self):
        return f"{self.nombre} {self.dni} - Actividad {self.id_actividad}"