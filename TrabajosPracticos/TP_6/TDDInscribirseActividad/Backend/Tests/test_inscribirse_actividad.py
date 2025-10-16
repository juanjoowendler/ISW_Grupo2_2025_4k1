import pytest
import requests


class TestInscribirseActividad:

    PORT = 6009
    API_URL = f'http://localhost:{PORT}/api'
    
    def test_inscribirse_a_actividad_con_cupos_disponibles_success(self):
        # Obtener actividades de tipo Palestra para que se pueda mandar talle
        data = requests.get(self.API_URL + "/actividades", params={"tipo":"Palestra","disponible":True}).json()
        # Crear inscripcion por default para que pase
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "nombre":"Emanuel Scrosati",
            "DNI":45074602,
            "edad":22,
            "cant_personas":1,
            "talle":"XL",
            "terminosYcondiciones":True
        }
        assert requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion).status_code == 201

    def test_inscribirse_a_actividad_sin_cupos_para_horario_seleccionado_fail(self):
        # Obtener alguna actividad disponible
        data = requests.get(self.API_URL + "/actividades", params={"disponible":True}).json()
        # Crear inscripcion con demasiados integrantes para que falle
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "nombre":"Emanuel Scrosati",
            "DNI":45074602,
            "edad":22,
            "cant_personas":30,
            "terminosYcondiciones":True
        }
        assert requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion).status_code == 400

    def test_inscribirse_a_actividad_sin_seleccionar_talle_en_actividad_no_requerida_success(self):
        # Obtener alguna actividad de tipo Safari para no requerir mandar talle
        data = requests.get(self.API_URL + "/actividades", params={"tipo":"Safari","disponible":True}).json()
        # Crear inscripcion por default para que pase
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "nombre":"Emanuel Scrosati",
            "DNI":45074602,
            "edad":22,
            "cant_personas":1,
            "terminosYcondiciones":True
        }
        assert requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion).status_code == 201

    def test_inscribirse_a_actividad_no_disponible_fail(self):
        # Obtener alguna actividad no disponible
        data = requests.get(self.API_URL + "/actividades", params={"disponible":False}).json()
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "nombre":"Emanuel Scrosati",
            "DNI":45074602,
            "edad":22,
            "cant_personas":1,
            "terminosYcondiciones":True
        }
        assert requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion).status_code == 400

    def test_inscribirse_a_actividad_sin_aceptar_terminos_y_condiciones_fail(self):
        # Obtener alguna activadad disponible
        data = requests.get(self.API_URL + "/actividades", params={"disponible":True}).json()
        # Crear inscripcion sin aceptar los terminos y condiciones para que falle
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "nombre":"Emanuel Scrosati",
            "DNI":45074602,
            "edad":22,
            "cant_personas":1,
            "terminosYcondiciones":False
        }
        assert requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion).status_code == 400

    def test_inscribirse_a_actividad_sin_ingresar_talle_en_activdad_requerida_fail(self):
        # Obtener alguna actividad de tipo Palestra para requerir talle
        data = requests.get(self.API_URL + "/actividades", params={"tipo":"Palestra","disponible":True}).json()
        # Crear inscripcion sin poner talle para que falle
        inscripcion = {
            "id_actividad":data[0]["id_actividad"],
            "nombre":"Emanuel Scrosati",
            "DNI":45074602,
            "edad":22,
            "cant_personas":1,
            "terminosYcondiciones":True
        }
        assert requests.post(self.API_URL + "/inscribirse_actividad", json=inscripcion).status_code == 400
