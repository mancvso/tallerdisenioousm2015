#!/bin/bash
curl -X POST http://localhost:3000/api/llamados \
-H "Content-Type: application/json" \
-d '{
	"nombre":"Puntos de reciclaje",
	"descripcion":"La ciudad debería tener más lugares para los desechos y aprovechar esas instancias para reciclar. Se estudia la posibilidad de instalar centros de reciclaje en las plazaas públicas.",
	"agenda": [ {"detalle":"Estudio preliminar"}, {"detalle":"Implementación"}],
	"objetivos": [
		{"prioridad":"baja", "descripcion": "Probar la plataforma"},
		{"prioridad":"alta", "descripcion":"Mantener más limpia la ciudad"}
	]
}'

curl -X POST http://localhost:3000/api/llamados \
-H "Content-Type: application/json" \
-d '{
	"nombre":"Perrera Municipal",
	"descripcion":"Es necesario que el municipio actualice sus pol´iticas respecto a animales ferales.",
	"agenda": [ {"detalle":"Conformacion"}, {"detalle":"Puesta en marcha"}],
	"objetivos": [
		{"prioridad":"baja", "descripcion": "Probar la plataforma"},
		{"prioridad":"alta", "descripcion": "Acariciar a los animalitos"}
	]
}'