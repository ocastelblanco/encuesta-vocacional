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
$id = "".$_GET['id'];
if ($id){
    $numFilas = $database->delete($TABLA,array('id'=>$id));
}
echo json_encode(['filas_afectadas'=>$numFilas], 256);
?>