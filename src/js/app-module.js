/* global angular */
var app = angular.module('app', [
    'ngRoute',
    'ngTouch',
    'ngAnimate',
    'ui.bootstrap',
    'chart.js',
    'rzModule'
]);
var tiposDocumentos = [
    {'num':'1','doc':'Cédula de Ciudadanía'},
    {'num':'2','doc':'Tarjeta de Identidad'},
    {'num':'3','doc':'Cédula de Extranjería'},
    {'num':'4','doc':'Pasaporte'},
    {'num':'5','doc':'Registro Civil'}
];
var tiposModalidades = [
    {'num':'1','tipo':'Presencial'},
    {'num':'2','tipo':'Virtual'}
];
var tiposLabels = [
    ['Artístico','Comunicativo'],
    ['Convencional','Analítico'],
    ['Empresarial','Emprendedor'],
    ['Social','Investigador']
];
// Controladores
app.controller('main', [function(){
    console.log('main');
}]);
app.controller('contenedor', ['datos', '$rootScope', '$uibModal', '$timeout', '$scope', function(datos, $rootScope, $uibModal, $timeout, $scope){
    console.log('contenedor');
    var rutasCont = {
        '/': 'uno',
        '/1': 'uno',
        '/2': 'dos',
        '/3': 'tres',
        '/4': 'cuatro',
        '/5': 'cinco',
        '/6': 'seis',
        '/7': 'siete'
    };
    var per = [0,0,0,0];
    var int = [0,0,0,0];
    var bloques = ['A', 'B', 'C', 'D', 'E'];
    var preCargaDatos = false;
    var yo = this;
    yo.banner = 'views/banner.html';
    yo.footer = 'views/footer.html';
    yo.avance = 'views/avance.html';
    yo.nav = 'views/nav.html';
    yo.encuesta = 'views/uno.html';
    yo.alertas = {
        'guardando': {
            'visible': false,
            'texto': 'Guardando...',
            'estilo': 'warning',
            'icono': 'fa-spinner fa-spin'
        },
        'correcto': {
            'visible': false,
            'texto': 'Datos guardados correctamente',
            'estilo': 'success',
            'icono': 'fa-check'
        },
        'error': {
            'visible': false,
            'texto': 'Ha ocurrido un error al intentar guardar los datos. Intenta de nuevo.',
            'estilo': 'danger',
            'icono': 'fa-exclamation-circle'
        }
    };
    yo.navegacion = [
        {'bloque': 'Datos', 'pag': 2, 'destino': 'Bloque A'},
        {'bloque': 'A', 'pag': 3, 'destino': 'Bloque B'},
        {'bloque': 'B', 'pag': 4, 'destino': 'Bloque C'},
        {'bloque': 'C', 'pag': 5, 'destino': 'Bloque D'},
        {'bloque': 'D', 'pag': 6, 'destino': 'Bloque E'}
    ];
    yo.pag = 1;
    yo.totalCampos = 51;
    yo.datos = {};
    $rootScope.$watch(function(){return yo.datos}, function(nuevo,viejo){
        angular.forEach(yo.datos, function(valor, llave) {
            if (!valor) {
                delete yo.datos[llave];
            }
        });
        yo.dataAvance = [Object.keys(yo.datos).length, yo.totalCampos-Object.keys(yo.datos).length];
        yo.porcentajeAvance = Math.floor(((yo.dataAvance[0]/yo.totalCampos) * 100)+0.5) + '%';
    }, true);
    $rootScope.$watch(function(){return yo.alertas}, function(nuevo,viejo){
        angular.forEach(nuevo, function(valor, llave) {
            if (valor.visible == true) {
                $timeout(function(){
                    valor.visible = false;
                },3000);
            }
        });
    }, true);
    yo.labelsAvance = ['Completado', 'Por completar'];
    yo.opcionesAvance = {
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var porcentaje = Math.floor(((currentValue/total) * 100)+0.5);
                    return data.labels[tooltipItem.index] + ' ' + porcentaje + '%';
                }
            }
        },
        rotation: 0.8 * Math.PI,
        circumference: 1.4 * Math.PI,
        cutoutPercentage: 85
    };
    var changeColor = function(chart){
        var ctx = chart.chart.ctx;
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(220,220,220,1)');
        var gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient2.addColorStop(0, 'rgba(255,0,0,0.5)');
        gradient2.addColorStop(1, 'rgba(255,255,0,0.5)');
        chart.chart.config.data.datasets[0].backgroundColor = [gradient2, gradient];
    };
    $scope.$on('chart-create', function (evt, chart) {
        if (chart.chart.canvas.id === 'doughnut') {
          changeColor(chart);
          chart.update();
        }
    });
    yo.coloresAvance = ['#F7464A','#DCDCDC'];
    yo.avanzar = function(destino) {
        yo.pag = destino;
        yo.encuesta = 'views/'+rutasCont['/'+destino]+'.html';
        guardarDatos();
        var numP = destino - 3;
        if (destino > 2) {
            for (var i=0;i<per.length;i++) {
                per[i] = per[i] + yo.datos[bloques[numP]+(i+1)];
                int[i] = int[i] + yo.datos[bloques[numP]+(i+5)];
            }
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
        if (bloque != 'Datos') {
            for (var i=1;i<9;i++) {
                if (!yo.datos[bloque+i]) {
                    salida = false;
                }
            }
        }
        if (!yo.datos.nombres || !yo.datos.apellidos || !yo.datos.tipo ||
            !yo.datos.documento || !yo.datos.email || !yo.datos.celular ||
            !yo.datos.departamento || !yo.datos.ciudad) {
            salida = false;
        }
        return !salida;
    };
    yo.verificaCampo = function(campo, valor){
        datos.buscar(campo,valor).then(function(resp){
            if (resp.id && !preCargaDatos) {
                preCargaDatos = true;
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal.html',
                    controller: modalPreCargaDatos
                });
                modalInstance.result.then(function(accion){
                    if(accion){cargarDatos(resp.id)}
                });
            }
        });
    };
    var modalPreCargaDatos = ['$uibModalInstance', '$scope', function($uibModalInstance, $scope){
        $scope.titulo = 'Tus datos ya existen';
        $scope.cuerpo = 'Tus datos ya están en nuestra base de datos. ¿Deseas cargarlos todos?';
        $scope.accion = function(accion){
            $uibModalInstance.close(accion);
        };
    }];
    yo.grabarDatos = function() {
        guardarDatos();
    };
    yo.limpiaNumDocumento = function(){
        var regEx;
        if (yo.datos.tipo == '1' || yo.datos.tipo == '2' || yo.datos.tipo == '5') {
            regEx = /[0-9]/;
        } else {
            regEx = /[0-9a-zA-Z]/;
        }
        var endChar = String(yo.datos.documento).slice(-1);
        var esNumero = regEx.test(endChar);
        if (!esNumero) {
            console.log('No es un número', yo.datos.documento);
            yo.datos.documento = yo.datos.documento.slice(0,-1);
        }
    };
    function cargarDatos(id) {
        datos.consulta(id).then(function(resp){
            resp.celular = Number(resp.celular);
            angular.forEach(tiposDocumentos, function(valor, llave) {
                if (valor.doc == resp.tipo) {
                    resp.tipo = valor.num;
                } 
            });
            angular.forEach(tiposModalidades, function(valor, llave) {
                if (valor.tipo == resp.modalidad) {
                    resp.modalidad = valor.num;
                } 
            });
            angular.forEach(bloques,function(val,key){
                for(var i=1;i<9;i++) {
                    resp[val+String(i)] = Number(resp[val+String(i)]);
                }
            });
            yo.datos = resp;
        });
    }
    function guardarDatos() {
        yo.alertas.guardando.visible = true;
        datos.guardar(yo.datos).then(function(resp){
            yo.alertas.guardando.visible = false;
            if(resp.id) {
                yo.datos.id = resp.id;
            }
            if (resp.salida[0] != '00000') {
                yo.alertas.error.visible = true;
            } else {
                yo.alertas.correcto.visible = true;
            }
        });
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
            var promesa = $http.get('php/buscar.php?id='+id).then(function(resp){
                return resp.data;
            });
            return promesa;
        },
        guardar: function(datos) {
            var promesa = $http.post('php/guardar.php',datos).then(function(resp){
                return resp.data;
            });
            return promesa;
        }
    };
    return datos;
}]);