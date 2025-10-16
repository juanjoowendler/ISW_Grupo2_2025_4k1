from django.db import models
import datetime
from django.utils import timezone
# Create your models here.

class Inscripcion(models.Model):
    id = models.AutoField(primary_key=True)
    id_actividad = models.IntegerField()
    nombre = models.CharField(max_length=100)
    dni = models.IntegerField()
    edad = models.IntegerField()
    cant_personas = models.IntegerField()
    talle = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.dni} - Actividad {self.id_actividad}"
    
class Actividad(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha = models.DateField()
    hora = models.TimeField()
    cupo_disponible = models.IntegerField()


    
    def __str__(self):
        return self.tipo

    def esta_disponible(self):
        hoy = timezone.now().date()
        cinco_minutos_despues = (datetime.datetime.now() + datetime.timedelta(minutes=5)).time()
        return self.cupo_disponible > 0 and (self.fecha > hoy or self.fecha == hoy and self.hora >= cinco_minutos_despues)
    
    