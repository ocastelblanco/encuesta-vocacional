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
$datos = json_decode(file_get_contents('php://input'),true);
$datos['fecha'] = date("Y-m-d H:i:s");
if ($datos['id']){
    $numFilas = $database->update($TABLA,$datos,array('id'=>$datos['id']));
} else {
    $id = $database->insert($TABLA,$datos);
}
$salida = array('id'=>$id, 'salida'=>$database->error());
echo json_encode($salida, 256);
?>