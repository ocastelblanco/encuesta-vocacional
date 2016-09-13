/* global angular */

var app = angular.module('app', [
    'ngRoute',
    'ngTouch',
    'ngAnimate',
    'ui.bootstrap',
    'chart.js',
    'rzModule'
]);
var tiposDocumentos = ['','Cédula de Ciudadanía','Tarjeta de Identidad','Cédula de Extranjería','Pasaporte','Registro Civil'];
var tiposModalidades = ['','Presencial','Virtual'];
var tiposLabels = [['Artístico','Comunicativo'],['Convencional','Analítico'],['Empresarial','Emprendedor'],['Social','Investigador']];
// Controladores
app.controller('main', [function(){
    console.log('main');
}]);
app.controller('contenedor', ['datos', function(datos){
    console.log('contenedor');
    var rutasCont = {'/': 'uno', '/1': 'uno', '/2': 'dos', '/3': 'tres', '/4': 'cuatro', '/5': 'cinco', '/6': 'seis', '/7': 'siete'};
    var per = [0,0,0,0];
    var int = [0,0,0,0];
    var bloques = ['A', 'B', 'C', 'D', 'E'];
    var yo = this;
    yo.banner = 'views/banner.html';
    yo.footer = 'views/footer.html';
    yo.encuesta = 'views/uno.html';
    yo.datos = {};
    yo.avanzar = function(destino) {
        yo.encuesta = 'views/'+rutasCont['/'+destino]+'.html';
        var numP = destino - 3;
        if (destino > 2) {
            for (var i=0;i<per.length;i++) {
                per[i] = per[i] + yo.datos[bloques[numP]+(i+1)];
                int[i] = int[i] + yo.datos[bloques[numP]+(i+5)];
            }
            guardarDatos();
        }
        yo.graficoData = [per,int];
        var tendencia = 0;
        angular.forEach(per, function(valor,llave){
            if (tendencia < (valor+int[llave])) {
                tendencia = (valor+int[llave]);
                yo.tendencia = tiposLabels[llave][0]+'-'+tiposLabels[llave][1];
            }
        });
    };
    yo.opcionesSlider = {
        floor: 0,
        ceil: 4,
        stepsArray: [
            {value: 0, legend: ''},
            {value: 1, legend: 'Nunca'},
            {value: 2, legend: 'Casi nunca'},
            {value: 3, legend: 'Casi siempre'},
            {value: 4, legend: 'Siempre'}
        ],
        showTicksValues: true,
        showTicks: true,
        minLimit: 1
    };
    yo.validar = function(bloque) {
        var salida = true;
        for (var i=1;i<9;i++) {
            if (!yo.datos[bloque+i]) {
                salida = false;
            }
        }
        return !salida;
    };
    yo.verificaCampo = function(campo, valor){
        datos.buscar(campo,valor).then(function(resp){
            if (resp.id) {
                //  -----------------> Activar Modal!!!!!
                console.log('Activar modal');
                cargarDatos(resp.id);
            }
        });
    };
    yo.grabarDatos = function() {
        guardarDatos();
    };
    function cargarDatos(id) {
        datos.consulta(id).then(function(resp){
            resp.celular = Number(resp.celular);
            resp.tipo = String(tiposDocumentos.indexOf(resp.tipo));
            resp.modalidad = String(tiposModalidades.indexOf(resp.modalidad));
            angular.forEach(bloques,function(val,key){
                for(var i=1;i<9;i++) {
                    resp[val+String(i)] = Number(resp[val+String(i)]);
                }
            });
            yo.datos = resp;
        });
    }
    function guardarDatos() {
        // -------> Guarda datos en la db
        console.log('Guardar data');
    }
}]);
app.controller('paso1', ['json', function(json){
    console.log('paso1');
    var yo = this;
    json('municipios').then(function(resp){
        yo.municipios = resp;
    });
    yo.tipos = tiposDocumentos;
}]);
app.controller('paso2', ['json', function(json){
    console.log('paso2');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[0];
    });
}]);
app.controller('paso3', ['json', function(json){
    console.log('paso3');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[1];
    });
}]);
app.controller('paso4', ['json', function(json){
    console.log('paso4');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[2];
    });
}]);
app.controller('paso5', ['json', function(json){
    console.log('paso5');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[3];
    });
}]);
app.controller('paso6', ['json', function(json){
    console.log('paso6');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[4];
    });
}]);
app.controller('paso7', [function(){
    console.log('paso7');
    var yo = this;
    yo.labels = tiposLabels;
    yo.series = ['Personalidad', 'Interés'];
    yo.modalidades = tiposModalidades;
}]);
// Servicios
app.service('json', ['$http', function($http){
    var json = function(datos){
        var promesa = $http.get('assets/'+datos+'.json').then(function(resp){
            return resp.data;
        });
        return promesa;
    };
    return json;
}]);
app.service('datos', ['$http', function($http){
    var datos = {
        buscar: function(campo, valor) {
            var promesa = $http.get('php/buscar.php?'+campo+'='+valor).then(function(resp){
                return resp.data;
            });
            return promesa;
        },
        consulta: function(id) {
            var promesa = $http.post('php/buscar.php?id='+id).then(function(resp){
                return resp.data;
            });
            return promesa;
        }
    };
    return datos;
}]);