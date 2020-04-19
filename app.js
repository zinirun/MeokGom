var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler'),
    expressErrorHandler = require('express-error-handler'),
    expressSession = require('express-session'),
    ejs = require('ejs'),
    fs = require('fs'),
    url = require('url'), //채팅 모듈
    cors = require('cors'); //ajax 요청시 cors 지원

app.set('port', process.env.PORT || 80);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
app.use(cors());

var router = express.Router();

//MainPage 라우터
router.route('/').get(function (req, res) {

    fs.readFile('./public/index.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
        }));
    });
});

app.use('/', router);

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//웹서버 생성
http.listen(app.get('port'),
    function () {
        console.log('express server started with port ' + app.get('port'));
    }
);
