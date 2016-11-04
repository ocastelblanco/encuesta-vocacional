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
$data = $database->select($TABLA, "*");
echo json_encode($data, 256);
?>