/* global angular */

var app = angular.module('app', [
    'ngRoute',
    'ngTouch',
    'ngAnimate',
    'ui.bootstrap',
    'chart.js',
    'rzModule'
]);

// Controladores
app.controller('main', [function(){
    console.log('main');
}]);
app.controller('contenedor', ['$location',function($location){
    console.log('contenedor');
    var rutasCont = {'/': 'uno', '/1': 'uno', '/2': 'dos', '/3': 'tres', '/4': 'cuatro', '/5': 'cinco', '/6': 'seis', '/7': 'siete'};
    var yo = this;
    yo.banner = 'views/banner.html';
    yo.footer = 'views/footer.html';
    //yo.encuesta = 'views/'+rutasCont[$location.path()]+'.html';
    yo.encuesta = 'views/uno.html';
    yo.datos = {};
    yo.avanzar = function(destino) {
        yo.encuesta = 'views/'+rutasCont['/'+destino]+'.html';
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
}]);
app.controller('paso1', ['json',function(json){
    console.log('paso1');
    var yo = this;
    json('municipios').then(function(resp){
        yo.municipios = resp;
    });
    yo.tipos = ['Cédula de Ciudadanía','Tarjeta de Identidad','Cédula de Extranjería','Pasaporte','Registro Civil'];
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
    yo.labels = ['Artístico-Comunicativo', 'Convencional-Analítico', 'Empresarial-Emprendedor', 'Social-Investigador'];
    yo.series = ['Personalidad', 'Interés'];
    yo.data = [
        [5, 9, 7, 20],
        [5, 5, 7, 20]
    ];
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