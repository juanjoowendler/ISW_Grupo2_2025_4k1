from django.db import models
import datetime
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

class Inscripcion(models.Model):
    id = models.AutoField(primary_key=True)
    id_actividad = models.IntegerField()
    cant_personas = models.IntegerField()
    
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
    
class Persona(models.Model):
    dni = models.PositiveIntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    edad = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(99)])
    talle = models.CharField(max_length=10, blank=True, null=True)  

    def __str__(self):
        return f"{self.nombre} DNI: {self.dni}"

class InscripcionPorPersona(models.Model):
    persona = models.ForeignKey('Persona', on_delete=models.CASCADE)
    inscripcion = models.ForeignKey(Inscripcion, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.persona.nombre}, DNI: {self.persona.dni} - Actividad: {self.inscripcion.tipo}"