"""
Inscribirme a actividad
COMO visitante QUIERO inscribirme a una actividad PARA reservar mi lugar en la
misma. SP3 

Criterios de Aceptación:

● Debe requerir seleccionar una actividad del conjunto de actividades de la lista de “Tirolesa”,
“Safari”, “Palestra” y “Jardinería”, siempre y cuando tengan cupos disponibles para el horario
seleccionado
● Debe requerir seleccionar el horario dentro de los disponibles
● Debe indicar la cantidad de personas que participaran de la actividad
● Para cada persona que participa, debe ingresar los datos del visitante: nombre, DNI, edad y talla
de vestimenta si la actividad lo demanda
● Debe requerir aceptar los términos y condiciones específicos de la actividad en la que
participarán.

- Probar inscribirse a una actividad del listado que poseen cupos disponibles, seleccionando un 
horario, ingresando los datos del visitante (nombre, DNI, edad, talla de la vestimenta si la 
actividad lo requiere) y aceptando los términos y condiciones (pasa) 

"""

import pytest
from flask import Flask

@pytest.fixture
def client():
    # Simulate a test client for the web application
    app = Flask(__name__)
    app.testing = True
    return app.test_client()

def test_inscribirse_a_actividad_con_cupos_disponibles_success(client):
    # Simulate a POST request to inscribe a visitor to an activity
    data = {
        "actividad": "Tirolesa",
        "horario": "10:00 AM",
        "cantidad_personas": 1,
        "visitantes": [
            {
                "nombre": "Juan Perez",
                "dni": "12345678",
                "edad": 30,
                "talla": "M"
            }
        ],
        "aceptar_terminos": True
    }
    response = client.post("/inscribirse", json=data)
    assert response.status_code == 200
    assert response.json["message"] == "Inscripción exitosa"

def test_inscribirse_a_actividad_sin_cupos_para_horario_seleccionado_fail(client):
    data = {
        "actividad": "Safari",
        "horario": "3:00 PM",
        "cantidad_personas": 2,
        "visitantes": [
            {
                "nombre": "Ana Lopez",
                "dni": "87654321",
                "edad": 25,
                "talla": "L"
            },
            {
                "nombre": "Carlos Gomez",
                "dni": "11223344",
                "edad": 28,
                "talla": "XL"
            }
        ],
        "aceptar_terminos": True
    }
    response = client.post("/inscribirse", json=data)
    assert response.status_code == 400
    assert response.json["error"] == "No hay cupos disponibles para el horario seleccionado"

def test_inscribirse_a_actividad_sin_seleccionar_talle_en_actividad_no_requerida_success(client):
    data = {
        "actividad": "Jardinería",
        "horario": "11:00 AM",
        "cantidad_personas": 1,
        "visitantes": [
            {
                "nombre": "Maria Gonzalez",
                "dni": "99887766",
                "edad": 35
            }
        ],
        "aceptar_terminos": True
    }
    response = client.post("/inscribirse", json=data)
    assert response.status_code == 200
    assert response.json["message"] == "Inscripción exitosa"

def test_inscribirse_a_actividad_no_disponible_fail(client):
    data = {
        "actividad": "Natación",
        "horario": "9:00 AM",
        "cantidad_personas": 1,
        "visitantes": [
            {
                "nombre": "Luis Martinez",
                "dni": "44556677",
                "edad": 40,
                "talla": "M"
            }
        ],
        "aceptar_terminos": True
    }
    response = client.post("/inscribirse", json=data)
    assert response.status_code == 404
    assert response.json["error"] == "La actividad seleccionada no está disponible"

def test_inscribirse_a_actividad_sin_aceptar_terminos_y_condiciones_fail(client):
    data = {
        "actividad": "Palestra",
        "horario": "2:00 PM",
        "cantidad_personas": 1,
        "visitantes": [
            {
                "nombre": "Sofia Ramirez",
                "dni": "33445566",
                "edad": 22,
                "talla": "S"
            }
        ],
        "aceptar_terminos": False
    }
    response = client.post("/inscribirse", json=data)
    assert response.status_code == 400
    assert response.json["error"] == "Debe aceptar los términos y condiciones para inscribirse"

def test_inscribirse_a_actividad_sin_ingresar_talle_en_activdad_requerida_fail(client):
    data = {
        "actividad": "Tirolesa",
        "horario": "4:00 PM",
        "cantidad_personas": 1,
        "visitantes": [
            {
                "nombre": "Pedro Sanchez",
                "dni": "22334455",
                "edad": 29
            }
        ],
        "aceptar_terminos": True
    }
    response = client.post("/inscribirse", json=data)
    assert response.status_code == 400
    assert response.json["error"] == "Debe ingresar la talla de vestimenta para esta actividad"