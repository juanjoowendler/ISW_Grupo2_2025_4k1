from django.apps import AppConfig
from django.utils import timezone
from django.db.utils import OperationalError, ProgrammingError
import datetime


class PollsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'polls'

    def ready(self):
        # Crear actividades al iniciar la app (si es necesario).
        # Se rodea en try/except para no romper migraciones o cuando la BD aún no está lista.

        try:
            Actividad = self.get_model('Actividad')
            today = timezone.now().date()
            # Cambiar la condición según la intención; aquí se crea sólo si NO hay actividades para hoy
            if Actividad.objects.filter(fecha=today).count() == 0:
                hora = datetime.time(hour=9)
                fecha = today
                for _ in range(18):
                    safari = Actividad(
                        tipo="Safari",
                        descripcion="Recorrido guiado en vehículo para observar de cerca distintas especies y conocer más sobre su hábitat.",
                        fecha=fecha,
                        hora=hora,
                        cupo_disponible=8)

                    palestra = Actividad(
                        tipo="Palestra",
                        descripcion="Muro de escalada para todas las edades que fomenta la actividad física y el trabajo en equipo.",
                        fecha=fecha,
                        hora=hora,
                        cupo_disponible=12)

                    jardineria = Actividad(
                        tipo="Jardineria",
                        descripcion="Actividad educativa donde se aprende sobre el cuidado de plantas y prácticas ecológicas del parque.",
                        fecha=fecha,
                        hora=hora,
                        cupo_disponible=12)

                    tirolesa = Actividad(
                        tipo="Tirolesa",
                        descripcion="Recorrido aéreo en cable de acero para disfrutar vistas panorámicas del parque y vivir una experiencia de aventura.",
                        fecha=fecha,
                        hora=hora,
                        cupo_disponible=10)

                    safari.save()
                    palestra.save()
                    jardineria.save()
                    tirolesa.save()

                    # avanzar 30 minutos
                    hora = (datetime.datetime.combine(datetime.date.today(), hora) + datetime.timedelta(minutes=30)).time()
        except (OperationalError, ProgrammingError):
            # DB no lista (ej. durante migrate) — no hacer nada
            pass
