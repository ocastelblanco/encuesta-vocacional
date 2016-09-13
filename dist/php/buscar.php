<?php
require_once('medoo.php');
require_once('inc.php');
$database = new medoo([
	'database_type' => 'mysql',
	'database_name' => $DB,
	'server' => $SERVIDOR,
	'username' => $USUARIO,
	'password' => $CLAVE,
	'charset' => 'utf8',
	'port' => 3306
]);
if ($_GET['id']) {
	$data = $database->select($TABLA, "*", ['id' => $_GET['id']])[0];
} else {
	$llave = array_keys($_GET)[0];
	$data = ["id" => $database->select($TABLA, "id", [$llave => $_GET[$llave]])[0]];
}
echo json_encode($data, JSON_UNESCAPED_UNICODE);
?>