<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
if (PHP_SAPI == 'cli')
	die('This example should only be run from a Web Browser');
require_once dirname(__FILE__) . '/PHPExcel.php';
require_once('inc.php');
require_once('medoo.php');
$objPHPExcel = new PHPExcel();
$objPHPExcel->getProperties()->setCreator("Oliver Castelblanco")
							 ->setLastModifiedBy("Oliver Castelblanco")
							 ->setTitle("Tabla de datos - Encuesta vocacional Politécnico Grancolombiano")
							 ->setSubject("Tabla de datos - Encuesta vocacional Politécnico Grancolombiano")
							 ->setDescription("Tabla de datos - Encuesta vocacional Politécnico Grancolombiano")
							 ->setKeywords("office 2007 openxml php vocacinal")
							 ->setCategory("Tabla datos");
$database = new medoo([
	'database_type' => 'mysql',
	'database_name' => $DB,
	'server' => $SERVIDOR,
	'username' => $USUARIO,
	'password' => $CLAVE,
	'charset' => 'utf8',
	'port' => 3306
]);
$data = $database->select($TABLA, "*");
$letraCeldas = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI","BJ","BK","BL","BM","BN","BO","BP","BQ","BR","BS","BT","BU","BV","BW","BX","BY","BZ"];
$valoresPreguntas = ["","Nunca","Casi nunca","Casi siempre","Siempre"];
for ($i=0;$i<count($titulos);$i++) {
    $celda = $letraCeldas[$i]."1";
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue($celda, $titulos[$i]);
}
for ($i=0;$i<count($data);$i++) {
    for ($e=0;$e<count($campos);$e++) {
        $celda = $letraCeldas[$e].($i+2);
        if ($e > 9 && $e < count($campos)-1) {
            $cont = $valoresPreguntas[$data[$i][$campos[$e]]];
        } else {
            $cont = $data[$i][$campos[$e]];
        }
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue($celda, $cont);
    }
}
for ($n=0;$n<4;$n++) {
    $celda = $letraCeldas[count($campos)+$n]."1";
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue($celda, $labels[$n]);
}
for ($i=0;$i<count($data);$i++) {
    for ($n=1;$n<5;$n++) {
        $resp[$i] = 0;
        for ($l=0;$l<count($bloques);$l++) {
            $resp[$i] = $resp[$i] + $data[$i][$bloques[$l].$n] + $data[$i][$bloques[$l].($n+4)];
        }
        $celda = $letraCeldas[count($campos)-1+$n].($i+2);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue($celda, $resp[$i]);
    }
}
for ($i=0;$i<count($letraCeldas);$i++)
    $objPHPExcel->getActiveSheet()->getColumnDimension($letraCeldas[$i])->setAutoSize(true);
$styleArray = array('font' => array('bold' => true));
$objPHPExcel->getActiveSheet()->getStyle('A1:BZ1')->applyFromArray($styleArray);
$objPHPExcel->getActiveSheet()->setTitle('Datos');
$objPHPExcel->setActiveSheetIndex(0);
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="tabla.xlsx"');
header('Cache-Control: max-age=0');
header('Cache-Control: max-age=1');
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
header ('Cache-Control: cache, must-revalidate');
header ('Pragma: public');
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
exit;