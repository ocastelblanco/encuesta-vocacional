/* global angular */

var admin = angular.module('admin', [
    'ngTouch',
    'ngAnimate',
    'ui.bootstrap',
    'ui.grid',
    //'ui.grid.selection',
    'ui.grid.pagination'
]);

// Controladores
admin.controller('main', ['sesion', '$rootScope', function(sesion, $rootScope){
    console.log('main');
    comprueba();
    var salida = this;
    $rootScope.$on('enSesion', function(){
        comprueba();
    });
    function comprueba() {
        sesion.comprobar().then(function(resp){
            if(!resp.id) {
                salida.contenido = 'login.html';
            } else {
                salida.contenido = 'tabla.html';
            }
        });
    }
}]);
admin.controller('adminLogin', ['sesion', '$rootScope', function(sesion, $rootScope){
    var salida = this;
    salida.ingreso = function() {
        sesion.md5(salida.user, salida.clave).then(function(resp){
            if (resp.usuario == '21232f297a57a5a743894a0e4a801fc3' && resp.clave == '055efc165011a33f3a1fcd58872c033b') {
                var sess = new Date();
                sesion.crear(sess.getTime(), salida.user).then(function(resp){
                    if (resp.sesionID) {
                        $rootScope.$emit('enSesion');
                    } else {
                        console.log('Error en la creación de la sesión');
                    }
                });
            } else {
                console.log('No sesion', resp);
                salida.verAlerta = true;
            }
        });
    };
    salida.cerrarAlerta = function() {
        salida.verAlerta = false;
    };
}]);
admin.controller('adminGeneral', ['i18nService','sesion', 'datos', '$rootScope', function(i18nService,sesion, datos, $rootScope){
    i18nService.setCurrentLang('es');
    var salida = this;
    salida.datosTabla = {
        //enableRowSelection: true,
        //enableSelectAll: false,
        //multiSelect: true,
        enableFiltering: true,
        //selectionRowHeaderWidth: 24,
        rowHeight: 24,
        showGridFooter:true,
        paginationPageSizes: [100, 200, 500, 1000],
        paginationPageSize: 100,
        gridMenuShowHideColumns: true,
        columnDefs: [
                {name: 'id', visible: false},
                {name: 'nombres', displayName: 'Nombre'},//, enableColumnMenu: false},
                {name: 'apellidos', displayName: 'Apellidos'},
                {name: 'tipo', displayName: 'Tipo de doc'},
                {name: 'documento', displayName: 'Número de doc'},
                {name: 'email', displayName: 'Email'},
                {name: 'celular', displayName: 'Celular'},
                {name: 'departamento', displayName: 'Departamento'},
                {name: 'ciudad', displayName: 'Ciudad'},
                {name: 'perfil1', displayName: 'Artístico-Comunicativo'},
                {name: 'perfil2', displayName: 'Convencional-Analítico'},
                {name: 'perfil3', displayName: 'Empresarial-Emprendedor'},
                {name: 'perfil4', displayName: 'Social-Investigador'},
                {name: 'fecha', displayName: 'Fecha de registro'}
        ]
    };
    cargaTabla();
    function cargaTabla() {
        datos.listar().then(function(resp){
            var bloques = ['A', 'B', 'C', 'D', 'E'];
            angular.forEach(resp, function(valor, llave){
                for (var i=1;i<5;i++) {
                    resp[llave]['perfil'+i] = 0;
                    for (var l=0;l<bloques.length;l++) {
                        resp[llave]['perfil'+i] = Number(resp[llave]['perfil'+i]) + Number(resp[llave][bloques[l]+i]) + Number(resp[llave][bloques[l]+(i+4)]);
                    }
                }
            });
            salida.datosTabla.data = resp;
        });
    }
    salida.salir = function() {
        sesion.cerrar().then(function(resp){
            $rootScope.$emit('enSesion');
        });
    };
}]);
// Servicios
admin.service('sesion', ['$http', function($http){
    var ruta = '../php/sesion.php?accion=';
    var sesion = {
        comprobar: function() {
            var accion = 'comprobar';
            var promesa = $http.get(ruta+accion).then(function(resp){
                return resp.data;
            });
            return promesa;
        },
        md5: function(user,pass){
            var accion = 'md5&usuario='+user+'&clave='+pass;
            var promesa = $http.get(ruta+accion).then(function(resp){
                return resp.data;
            });
            return promesa;
        },
        crear: function(sesionID,nombre) {
            var accion = 'crear&sesionID='+sesionID+'&nombre='+nombre;
            var promesa = $http.get(ruta+accion).then(function(resp){
                return resp.data;
            });
            return promesa;
        },
        cerrar: function() {
            var accion = 'cerrar';
            var promesa = $http.get(ruta+accion).then(function(resp){
                return resp.data;
            });
            return promesa;
        }
    };
    return sesion;
}]);
admin.service('datos', ['$http', function($http){
    var ruta = '../php/datos.php';
    var datos = {
        listar: function() {
            var promesa = $http.get(ruta).then(function(resp){
                return resp.data;
            });
            return promesa;
        }
    };
    return datos;
}]);