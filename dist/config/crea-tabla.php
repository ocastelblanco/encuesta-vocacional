<?php
error_reporting(0);
$accion = $_GET['accion'];
date_default_timezone_set('America/Bogota');
require_once('../php/inc.php');
$mysqli = new mysqli($SERVIDOR, $USUARIO, $CLAVE, $DB);
$mysqli->set_charset("utf8");
if ($mysqli->connect_errno) {
    $salida = array('resp'=>false, 'error'=>'conexion');
    echo json_encode($salida, 256);
    exit();
}
if ($accion == 'crear') {
    $query = file_get_contents('create_table.sql');
} elseif ($accion == 'poblar') {
    $query = file_get_contents('insert_data.sql');
} elseif ($accion == 'borrar') {
    $query = 'TRUNCATE TABLE '.$TABLA;
}
if ($mysqli->query($query) === TRUE) {
    $salida = array('resp'=>true);
} else {
    $salida = array('resp'=>false, 'error'=>'accion', 'desc'=>$mysqli->error);
}
$mysqli->close();
echo json_encode($salida, 256);
?>