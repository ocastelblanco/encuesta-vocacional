<?php
require_once('medoo.php');
require_once('inc.php');
$database = new medoo(array(
	'database_type' => 'mysql',
	'database_name' => $DB,
	'server' => $SERVIDOR,
	'username' => $USUARIO,
	'password' => $CLAVE,
	'charset' => 'utf8',
	'port' => 3306
));
if ($_GET['id']) {
	$busqueda = array('id' => $_GET['id']);
	$resultado = $database->select($TABLA,"*",$busqueda);
	$data = $resultado[0];
} else {
	$keys = array_keys($_GET);
	$llave = $keys[0];
	$busqueda = array($llave => $_GET[$llave]);
	$resultado = $database->select($TABLA,"id",$busqueda);
	$data = array("id" => $resultado[0]);
}
echo json_encode($data, 256);
?>