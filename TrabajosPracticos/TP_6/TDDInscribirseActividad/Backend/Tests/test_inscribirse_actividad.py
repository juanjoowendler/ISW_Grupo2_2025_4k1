import pytest
import requests


class TestInscribirseActividad:

    PORT = 8000
    API_URL = f'http://127.0.0.1:{PORT}/api'
    
    def test_inscribirse_a_actividad_con_cupos_disponibles_success(self):
        # Obtener actividades de tipo Palestra para que se pueda mandar talle
        data = requests.get(self.API_URL + "/actividades", params={"tipo":"Palestra","disponible":True}).json()
        # Crear inscripcion por default para que pase
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "personas":[{
                "nombre":"Emanuel Scrosati",
                "dni":45074602,
                "edad":22,
                "talle":"XL"
            }],
            "cant_personas":1,
            "terminosYcondiciones":True
        }
        response = requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion)
        assert response.status_code == 201
        assert response.json().get("mensaje") == "Inscripción registrada correctamente"
        assert response.json().get("actividad").lower() == 'palestra'
        assert response.json().get("cupo_restante") == data[0]["cupo_disponible"] - 1

    def test_inscribirse_a_actividad_sin_cupos_para_horario_seleccionado_fail(self):
        # Obtener alguna actividad disponible de Safari para tener un cupo maximo de 8
        data = requests.get(self.API_URL + "/actividades", params={"tipo": 'Safari', "disponible":True}).json()
        # Crear inscripcion con demasiados integrantes para que falle
        inscripcion = {
            "id_actividad": data[0]["id_actividad"],
            "personas": [
                {"nombre": "Emanuel Scrosati", "dni": 45074602, "edad": 22},
                {"nombre": "María Pérez", "dni": 30123456, "edad": 28},
                {"nombre": "Juan Gómez", "dni": 27456123, "edad": 35},
                {"nombre": "Lucía Fernández", "dni": 39214567, "edad": 30},
                {"nombre": "Carlos Ruiz", "dni": 24117890, "edad": 40},
                {"nombre": "Ana Torres", "dni": 31233455, "edad": 26},
                {"nombre": "Diego Martínez", "dni": 28877654, "edad": 33},
                {"nombre": "Sofía López", "dni": 34211223, "edad": 21},
                {"nombre": "Miguel Sánchez", "dni": 27555111, "edad": 29},
                {"nombre": "Valentina Rojas", "dni": 33388900, "edad": 24}
            ],
            "cant_personas": 10,
            "terminosYcondiciones": True
        }
        response = requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion)
        assert response.status_code == 400
        assert response.json().get("error") == "No hay cupos disponibles"

    def test_inscribirse_a_actividad_sin_seleccionar_talle_en_actividad_no_requerida_success(self):
        # Obtener alguna actividad de tipo Safari para no requerir mandar talle
        data = requests.get(self.API_URL + "/actividades", params={"tipo":"Safari","disponible":True}).json()
        # Crear inscripcion por default para que pase
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "personas":[{
                "nombre":"Emanuel Scrosati",
                "dni":45074602,
                "edad":22
            }],
            "cant_personas":1,
            "terminosYcondiciones":True
        }
        response = requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion)
        assert response.status_code == 201
        assert response.json().get("mensaje") == "Inscripción registrada correctamente"
        assert response.json().get("actividad").lower() == 'safari'
        assert response.json().get("cupo_restante") == data[0]["cupo_disponible"] - 1

    def test_inscribirse_a_actividad_no_disponible_fail(self):
        # Obtener alguna actividad no disponible
        data = requests.get(self.API_URL + "/actividades", params={"disponible":False}).json()
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "personas":[{
                "nombre":"Emanuel Scrosati",
                "dni":45074602,
                "edad":22
            }],
            "cant_personas":1,
            "terminosYcondiciones":True
        }
        response = requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion)
        assert response.status_code == 400
        assert response.json().get("error") == "La actividad no está disponible"

    def test_inscribirse_a_actividad_sin_aceptar_terminos_y_condiciones_fail(self):
        # Obtener alguna activadad disponible
        data = requests.get(self.API_URL + "/actividades", params={"disponible":True}).json()
        # Crear inscripcion sin aceptar los terminos y condiciones para que falle
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "personas":[{
                "nombre":"Emanuel Scrosati",
                "dni":45074602,
                "edad":22
            }],
            "cant_personas":1,
            "terminosYcondiciones":False
        }
        response = requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion)
        assert response.status_code == 400
        assert response.json().get("error") == "Debe aceptar los términos y condiciones"

    def test_inscribirse_a_actividad_sin_ingresar_talle_en_activdad_requerida_fail(self):
        # Obtener alguna actividad de tipo Palestra para requerir talle
        data = requests.get(self.API_URL + "/actividades", params={"tipo":"Palestra","disponible":True}).json()
        nombre = "Emanuel Scrosati"
        # Crear inscripcion sin poner talle para que falle
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "personas":[{
                "nombre": nombre,
                "dni":45074602,
                "edad":22
            }],
            "cant_personas":1,
            "terminosYcondiciones":True
        }
        response = requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion)
        assert response.status_code == 400
        assert response.json().get("error") == f"Debe ingresar el talle para: {nombre}"
