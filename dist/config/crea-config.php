<?php
error_reporting(0);
$datos = json_decode(file_get_contents('php://input'),true);
$contenido = '<?php'."\n";
$contenido .= '$SERVIDOR = "'.$datos['host'].'";'."\n";
$contenido .= '$USUARIO = "'.$datos['usuarioBD'].'";'."\n";
$contenido .= '$CLAVE = "'.$datos['claveBD'].'";'."\n";
$contenido .= '$DB = "'.$datos['bd'].'";'."\n";
$contenido .= '$USER_ADMIN = "'.md5($datos['usuario']).'";'."\n";
$contenido .= '$USER_CLAVE = "'.md5($datos['clave']).'";'."\n";
$contenido .= '?>';
$nombrearchivo = "../php/config.php";
if (!file_exists($nombrearchivo) || $datos['se']) {
    if (file_put_contents($nombrearchivo, $contenido) !== false) {
        $salida = array('resp'=>true);
    } else {
        $contenido  = '<?php<br>';
        $contenido .= '$SERVIDOR = "'.$datos['host'].'";<br>';
        $contenido .= '$USUARIO = "'.$datos['usuarioBD'].'";<br>';
        $contenido .= '$CLAVE = "'.$datos['claveBD'].'";<br>';
        $contenido .= '$DB = "'.$datos['bd'].'";<br>';
        $contenido .= '$USER_ADMIN = "'.md5($datos['usuario']).'";<br>';
        $contenido .= '$USER_CLAVE = "'.md5($datos['clave']).'";<br>';
        $contenido .= '?>';
        $salida = array('resp'=>false, 'noEscribir'=>true, 'datos'=>$contenido);
    }
} else {
    $salida = array('resp'=>false, 'existente'=>true);
}
echo json_encode($salida, 256);
?>