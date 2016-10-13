<?php
date_default_timezone_set('America/Bogota');
/**/
$SERVIDOR = "localhost";
$USUARIO = "ocastelblanco";
$CLAVE = "";
$DB = "c9";
/**/
/*
$SERVIDOR = "";
$USUARIO = "";
$CLAVE = "";
$DB = "";
*/
$TABLA = "encuesta";
$campos = ['id', 'nombres', 'apellidos', 'tipo', 'documento', 'email', 'celular', 'departamento', 'ciudad', 'modalidad'];
$titulos = ['ID', 'Nombres', 'Apellidos', 'Tipo de documento', 'Número de documento', 'Correo electrónico', 'Número de celular', 'Departamento', 'Ciudad', 'Modalidad'];
$bloques = ['A', 'B', 'C', 'D', 'E'];
$labels = ['Personalidad: Artístico-Comunicativo', 'Interés: Artístico-Comunicativo', 'Personalidad: Convencional-Analítico', 'Interés: Convencional-Analítico', 'Personalidad: Empresarial-Emprendedor', 'Interés: Empresarial-Emprendedor', 'Personalidad: Social-Investigador', 'Interés: Social-Investigador'];
for($e=0;$e<count($bloques);$e++) {
    for($i=1;$i<9;$i++) {
        array_push($campos, $bloques[$e].(string)$i);
        array_push($titulos, "Bloque ".$bloques[$e]." - Pregunta ".(string)$i);
    }
}
array_push($campos, 'fecha');
array_push($titulos, 'Fecha de registro');
?>