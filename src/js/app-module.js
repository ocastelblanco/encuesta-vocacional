/* global angular paper */
var app = angular.module('app', [
    'ngRoute',
    'ngTouch',
    //'ngAnimate', ------------> Se eliminan las animaciones
    'ngSanitize',
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
var graficoData;
// Controladores
app.controller('main', [function(){
    console.log('main');
}]);
app.controller('contenedor', ['datos', '$rootScope', '$uibModal', '$timeout', '$scope', 'json', '$window', function(datos, $rootScope, $uibModal, $timeout, $scope, json, $window){
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
    yo.contenedor = 'views/inicio.html';
    yo.banner = 'views/banner.html';
    yo.footer = 'views/footer.html';
    yo.intro = 'views/intro.html';
    yo.datosP = 'views/uno.html';
    yo.avance = 'views/avance.html';
    yo.nav = 'views/nav.html';
    yo.encuesta = 'views/dos.html';
    yo.resultados = 'views/siete.html';
    yo.imgFondo = 'views/img-fondo.html';
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
        {'bloque': 'Datos', 'pag': 2, 'destino': 'Bloque A', 'icono': 'icono-bloque-a'},
        {'bloque': 'A', 'pag': 3, 'destino': 'Bloque B', 'icono': 'icono-bloque-b'},
        {'bloque': 'B', 'pag': 4, 'destino': 'Bloque C', 'icono': 'icono-bloque-c'},
        {'bloque': 'C', 'pag': 5, 'destino': 'Bloque D', 'icono': 'icono-bloque-d'},
        {'bloque': 'D', 'pag': 6, 'destino': 'Bloque E', 'icono': 'icono-bloque-e'}
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
        /*rotation: 0.8 * Math.PI,
        circumference: 1.4 * Math.PI,
        cutoutPercentage: 85*/
        rotation: 0.5 * Math.PI,
        cutoutPercentage: 65
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
    var retro;
    json('realimentacion').then(function(resp){
        retro = resp;
    });
     // ---------------------------------------------------------------> Activar guardarDatos() en producción
    yo.avanzar = function(destino) {
        yo.pag = destino;
        yo.encuesta = 'views/'+rutasCont['/'+destino]+'.html';
        $timeout(function(){
            $window.scroll(0, 0);
        },500);
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
                yo.realimentacion = retro[llave];
            }
        });
        switch (destino) {
            case 1:
                yo.contenedor = 'views/inicio.html';
                break;
            case 7:
                graficoData = yo.graficoData;
                yo.contenedor = 'views/resultados.html';
                break;
            default:
                yo.contenedor = 'views/encuesta.html';
        }
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
            !yo.datos.departamento || !yo.datos.ciudad || !yo.terminos) {
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
                    controller: modalPreCargaDatos,
                    keyboard: false,
                    backdrop: 'static'
                });
                modalInstance.result.then(function(accion){
                    if(accion){cargarDatos(resp.id)}
                });
            }
        });
    };
    var modalPreCargaDatos = ['$uibModalInstance', '$scope', function($uibModalInstance, $scope){
        $scope.titulo = 'Tus datos ya existen';
        $scope.cuerpo = 'Tus datos ya se encuentran registrados en nuestra base de datos ¿deseas continuar con tu test vocacional? En caso de responder NO, tus datos serán borrados y se iniciará un test en blanco.';
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
    yo.cargaInicio = function() {
        yo.contenedor = 'views/inicio.html';
    };
}]);
app.controller('paso1', ['json', function(json){
    console.log('paso1');
    var yo = this;
    json('municipios').then(function(resp){
        yo.municipios = resp;
    });
    yo.tipos = tiposDocumentos;
    yo.placeDoc = 'Debes seleccionar un Tipo de documento';
    yo.placeMun = 'Debes seleccionar un Departamento';
    yo.cambiaTipo = function(){
        yo.placeDoc = 'Número de documento de identidad'
    };
    yo.cambiaDepto = function(tipo){
        if (tipo) {
            yo.placeMun = 'Municipio';
        } else {
            yo.placeMun = 'Debe seleccionar un Departamento';
        }
    };
}]);
app.controller('paso2', ['json', function(json){
    console.log('paso2');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[0];
    });
    yo.bloque = 'A';
    yo.pag = 2;
}]);
app.controller('paso3', ['json', function(json){
    console.log('paso3');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[1];
    });
    yo.bloque = 'B';
    yo.pag = 3;
}]);
app.controller('paso4', ['json', function(json){
    console.log('paso4');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[2];
    });
    yo.bloque = 'C';
    yo.pag = 4;
}]);
app.controller('paso5', ['json', function(json){
    console.log('paso5');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[3];
    });
    yo.bloque = 'D';
    yo.pag = 5;
}]);
app.controller('paso6', ['json', function(json){
    console.log('paso6');
    var yo = this;
    json('preguntas').then(function(resp){
        yo.preguntas = resp[4];
    });
    yo.bloque = 'E';
    yo.pag = 6;
}]);
app.controller('paso7', ['$window', function($window){
    console.log('paso7');
    var yo = this;
    yo.labels = tiposLabels;
    yo.series = ['Personalidad', 'Interés'];
    yo.modalidades = tiposModalidades;
    prepararGraficos($window.innerHeight);
    angular.element($window).bind('resize', function(){
        prepararGraficos($window.innerHeight);
    });
}]);
function prepararGraficos(innerH) {
    var graficos = [];
    var totalValores = 0;
    var dataGraficos = [];
    angular.forEach(graficoData[0], function(valor, llave) {
        graficos[llave] = new paper.PaperScope();
        graficos[llave].setup('grafico'+llave);
        totalValores += valor + graficoData[1][llave];
        // Se suma un porcentaje adicional para evitar empates
        dataGraficos.push(valor + graficoData[1][llave] + ((5 - llave) / 10));
    });
	paper = graficos[0];
	var ancho = paper.view.size.width;
	var alto = ancho + (ancho * 0.1) + 38;
	paper.view.viewSize.height = alto;
	var colorGraficos = [{
	        'baseBack': new paper.Color(1,0.4,0,0.15),
	        'baseFront': new paper.Color(1,0.4,0,0.25),
	        'arcoBack': new paper.Color(1,0.4,0,0.15),
	        'arcoFront': new paper.Color(1,0.4,0,0.5)
	    },{
	        'baseBack': new paper.Color(0,0.65,0.85,0.15),
	        'baseFront': new paper.Color(0,0.65,0.85,0.25),
	        'arcoBack': new paper.Color(0,0.65,0.85,0.15),
	        'arcoFront': new paper.Color(0,0.65,0.85,0.5)
    }];
	angular.forEach(graficos, function(valor, llave) {
        paper = valor;
	    paper.view.viewSize.height = alto;
	    /* ------------> Dibuja fondos de graphs para reviews
        var fondo = paper.Path.Rectangle(new paper.Point(0,0),new paper.Point(ancho,alto));
        fondo.fillColor = new paper.Color(0,0,0,0.25);
        */
        var porcentaje = dataGraficos[llave] / totalValores;
        var color;
        if (dataGraficos[llave] == Math.max.apply(Math, dataGraficos)) {
            color = colorGraficos[0];
        } else {
            color = colorGraficos[1];
        }
        dibujarGrafico(paper, ancho, porcentaje, tiposLabels[llave], color, innerH);
    });
}
function dibujarGrafico(paper, ancho, porcentaje, titulo, color, innerH) {
    var radioBack = ancho / 2;
    var radioFront = radioBack * 0.8;
    var x = ancho / 2;
    var y = ancho / 2;
    var centro = new paper.Point(x,y);
    var baseBack = new paper.Path.Circle(centro,radioBack);
    baseBack.fillColor = color.baseBack;
    var arcoBack = arco(centro,radioBack,porcentaje,'arcoBack');
    var baseFront = new paper.Path.Circle(centro,radioFront);
    baseFront.fillColor = color.baseFront;
    //var arcoFront = arco(centro,radioFront,0.01,'arcoFront');
    
            var punto = new paper.Path.Circle(centro,5);
            punto.fillColor = new paper.Color(1,1,1,1);
            var linea = new paper.Path.Line(centro, new paper.Point(x,ancho * 1.05));
            linea.strokeColor = new paper.Color(1,1,1,1);
            linea.strokeWidth = 2;
            var texto = new paper.PointText(new paper.Point(x,(ancho * 1.175)));
            texto.content = titulo[0]+'\n'+titulo[1];
            texto.fillColor = 'white';
            if (innerH < 768) {
                texto.fontSize = '14px';
            } else {
                texto.fontSize = '16px';
            }
            texto.justification = 'center';
            
	        var arcoFront = arco(centro,radioFront,porcentaje,'arcoFront');
            
    function arco(cnt,radio,pcj,col) {
        var x1 = (radio * Math.cos(0)) + x;
        var y1 = (radio * Math.sin(0)) + y;
        var x2 = (radio * Math.cos(Math.PI*pcj)) + x;
        var y2 = (radio * Math.sin(Math.PI*pcj)) + y;
        var x3 = (radio * Math.cos(Math.PI*pcj*2)) + x;
        var y3 = (radio * Math.sin(Math.PI*pcj*2)) + y;
        var from = new paper.Point(x1, y1);
        var through = new paper.Point(x2, y2);
        var to = new paper.Point(x3, y3);
        var path = new paper.Path.Arc(from, through, to);
        path.add(cnt);
        path.fillColor = color[col];
        path.rotate(-90,cnt);
    }
    /* Se elimina el dibujo dinámico de los pasteles
	paper.view.onFrame = function(evento) {
        var avance = evento.count * (porcentaje / 60);
        if (avance <= porcentaje) {
	        var arcoFront = arco(centro,radioFront,avance,'arcoFront');
        }
        if (avance == porcentaje) {
            var punto = new paper.Path.Circle(centro,5);
            punto.fillColor = new paper.Color(1,1,1,1);
            var linea = new paper.Path.Line(centro, new paper.Point(x,ancho * 1.05));
            linea.strokeColor = new paper.Color(1,1,1,1);
            linea.strokeWidth = 2;
            var texto = new paper.PointText(new paper.Point(x,(ancho * 1.175)));
            texto.content = titulo[0]+'\n'+titulo[1];
            texto.fillColor = 'white';
            if (innerH < 768) {
                texto.fontSize = '14px';
            } else {
                texto.fontSize = '16px';
            }
            texto.justification = 'center';
        }
	};
    */
	paper.view.draw();
}
// Servicios
app.service('json', ['$http', function($http){
    var json = function(datos){
        var promesa = $http.get('assets/json/'+datos+'.json').then(function(resp){
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