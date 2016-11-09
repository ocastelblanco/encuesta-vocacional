/* global angular */
var config = angular.module('config', [
    'ngSanitize',
    'ngTouch',
    'ngAnimate',
    'ui.bootstrap'
]);
// Controladores
config.controller('main', ['crear', '$timeout', function(crear, $timeout){
    console.log('main');
    var yo = this;
    yo.numPasos = '4';
    yo.contenido = 'bd.html';
    yo.acciones = {
        paso1: function() {
            yo.contenido = 'usuario.html';
        },
        paso2: function() {
            yo.contenido = 'crear-config.html';
            yo.claseAlerta = 'alert-warning';
            yo.creaConfig = '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> <span>Creando archivo de configuración...</span>';
            $timeout(function(){
                crear.config(yo.datos).then(function(resp){
                    if (resp.resp) {
                        yo.claseAlerta = 'alert-success';
                        yo.creaConfig = '<i class="fa fa-thumbs-up"></i> <span>El archivo de configuración ha sido creado correctamente. No olvide el usuario y la contraseña de ingreso al sistema de administración de los resultados, ya que no podrá recuperarlo posteriormente.</span>';
                        yo.avanzar = true;
                    } else {
                        yo.claseAlerta = 'alert-danger';
                        if (resp.noEscribir) {
                            yo.creaConfig = '<i class="fa fa-thumbs-down"></i> <span>Ha ocurrido un error al crear el archivo de configuración: no se dispone de los permisos necesarios para escribir en el directorio correspondiente.</span>';
                            yo.infoAdicional = '<p>Copie y pegue el siguiente texto en un archivo en blanco, nombre ese archivo <code>config.php</code> y ubíquelo en la carpeta <code>/php</code> de la instalación.</p><p class="well">'+resp.datos+'</p><p>Luego de realizar esta acción, continúe con el procedimiento.</p>';
                            yo.avanzar = true;
                        }
                        if (resp.existente) {
                            yo.creaConfig = 'Ha ocurrido un error al crear el archivo de configuración: el archivo de configuración ya existe.';
                            yo.reintentar = true;
                        }
                    }
                });
            }, 750);
        },
        paso21: function() {
            yo.reintentar = false;
            yo.claseAlerta = 'alert-warning';
            yo.creaConfig = '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> <span>Sobreescribiendo archivo de configuración...</span>';
            yo.datos.se = true;
            $timeout(function(){
                crear.config(yo.datos).then(function(resp){
                    if (resp.resp) {
                        yo.claseAlerta = 'alert-success';
                        yo.creaConfig = '<i class="fa fa-thumbs-up"></i> <span>El archivo de configuración ha sido sobreescrito correctamente. No olvide el usuario y la contraseña de ingreso al sistema de administración de los resultados, ya que no podrá recuperarlo posteriormente.</span>';
                        yo.avanzar = true;
                    } else {
                        yo.claseAlerta = 'alert-danger';
                        if (resp.noEscribir) {
                            yo.creaConfig = '<i class="fa fa-thumbs-down"></i> <span>Ha ocurrido un error al sobreescribir el archivo de configuración: no se dispone de los permisos necesarios para escribir en el directorio correspondiente.</span>';
                            yo.infoAdicional = '<p>Edite el archivo <code>config.php</code> que se encuentra en la carpeta <code>/php</code> y reemplace su contenido por el siguiente.</p><p class="well">'+resp.datos+'</p>';
                            yo.avanzar = true;
                        }
                    }
                });
            }, 750);
        },
        paso3: function() {
            yo.contenido = 'crear-tabla.html';
            yo.claseAlerta = 'alert-warning';
            yo.creaConfig = '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> <span>Creando tabla en la base de datos...</span>';
            $timeout(function(){
                crear.tabla('crear').then(function(resp){
                    if (resp.resp) {
                        yo.claseAlerta = 'alert-success';
                        yo.creaConfig = '<i class="fa fa-thumbs-up"></i> <span>La tabla de datos ha sido creada correctamente.</span>';
                        yo.avanzar = true;
                        yo.creaTablaTex = 'Puede probar la configuración creando datos de prueba y comprobándolos. Para realizar esta acción haga clic en el siguiente botón.';
                        yo.creaTablaBtn = 'Crear datos de prueba';
                        yo.prueba = true;
                    } else {
                        yo.claseAlerta = 'alert-danger';
                        yo.avanzar = false;
                        if (resp.error == 'conexion') {
                            yo.creaConfig = '<i class="fa fa-thumbs-down"></i> <span>Ha ocurrido un error al conectarse a la base de datos. Recargue el navegador e intente la configuración de nuevo y registre los datos correctos que se le solicitan.</span>';
                        }
                        if (resp.error == 'accion') {
                            yo.creaConfig = '<i class="fa fa-thumbs-down"></i> <span>Ha ocurrido un error al crear la tabla; es posible que el usuario registrado no tenga los permisos suficientes. Consulte con el administrador del servidor e intente la configuración de nuevo, recargando el navegador.</span>';
                        }
                    }
                });
            }, 750);
        },
        paso4: function(prueba) {
            yo.claseAlerta = 'alert-warning';
            if (prueba) {
                yo.creaConfig = '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> <span>Creando datos de prueba...</span>';
                $timeout(function(){
                    crear.tabla('poblar').then(function(resp){
                        if (resp.resp) {
                            yo.avanzar = true;
                            yo.claseAlerta = 'alert-success';
                            yo.creaConfig = '<i class="fa fa-thumbs-up"></i> <span>Datos de prueba creados.</span>';
                            yo.prueba = false;
                            yo.creaTablaTex = 'Ingrese a la <a href="../admin/" target="_blank">interfaz de administración <i class="fa fa-external-link"></i></a> con el usuario y la contraseña de administador que acaba de definir. Cuando finalice, cierre la ventana y haga clic sobre el siguiente botón.';
                            yo.creaTablaBtn = 'Borrar datos de prueba';
                        }
                    });
                }, 750);
            } else {
                yo.avanzar = false;
                yo.creaConfig = '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> <span>Borrando datos de prueba...</span>';
                $timeout(function(){
                    crear.tabla('borrar').then(function(resp){
                        yo.claseAlerta = 'alert-success';
                        yo.creaConfig = '<i class="fa fa-thumbs-up"></i> <span>Datos de prueba borrados. La aplicación ha sido configurada correctamente.</span>';
                        crear.eliminar().then(function(resp){
                            yo.infoAdicional = 'Los archivos de configuración han sido eliminados y la aplicación está lista para ser usada. Cierre esta ventana.';
                        });
                    });
                }, 750);
            }
        }
    };
}]);
// Services
config.service('crear', ['$http', function($http){
    var crear = {
        config: function(data) {
            var promesa = $http.post('crea-config.php', data).then(function(resp){
                return resp.data;
            });
            return promesa;
        },
        tabla: function(accion) {
            var promesa = $http.get('crea-tabla.php?accion='+accion).then(function(resp){
                return resp.data;
            });
            return promesa;
        },
        eliminar: function() {
            var promesa = $http.get('../admin/eliminar-conf.php').then(function(resp){
                return resp.data;
            });
            return promesa;
        }
    };
    return crear;
}]);