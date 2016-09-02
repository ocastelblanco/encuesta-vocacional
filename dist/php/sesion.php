<?php
$accion = $_GET['accion'];
session_start();
if ($accion == 'comprobar') {
    echo json_encode(array('id' => $_SESSION['sesionID'], 'conexion' => true));
}
if ($accion == 'datos') {
    echo json_encode(array('nombre' => $_SESSION['nombre'], 'conexion' => true));
}
if ($accion == 'crear') {
    $sesionID = $_GET['sesionID'];
    $_SESSION['sesionID'] = $sesionID;
    $_SESSION['nombre'] = $_GET['nombre'];
    echo json_encode(array('conexion' => true, 'sesionID' => $sesionID));
}
if ($accion == 'cerrar') {
    unset($_SESSION['sesionID']);
    unset($_SESSION['nombre']);
    echo json_encode(array('conexion' => true));
}
if ($accion == 'md5') {
    echo json_encode(array('usuario'=>md5($_GET['usuario']), 'clave'=>md5($_GET['clave']), 'conexion' => true));
}
?>