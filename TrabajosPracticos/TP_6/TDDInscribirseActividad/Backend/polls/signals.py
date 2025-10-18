from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.utils import timezone
import datetime
from .models import Actividad
from .apps import PollsConfig

@receiver(post_migrate)
def crear_actividades_automaticas(sender, **kwargs):
    """Crea actividades automáticamente luego de aplicar migraciones."""
    try:
        cfg = PollsConfig("polls", None)
        today = timezone.now().date()
        
        DIAS_GENERAR = 160
        
        for i in range(DIAS_GENERAR):
            cfg.crear_actividades(today + datetime.timedelta(days=i), Actividad)
        
        print(f"[EcoPark] ✅ Se generaron actividades para {DIAS_GENERAR} días desde {today}.")

    except Exception as e:
        print(f"[EcoPark] ⚠️ Error al crear actividades automáticas: {e}")