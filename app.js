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

var mysql = require('mysql');

var mySqlClient = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'wjswls1',
    database: 'meokgom',
    dateStrings: 'date',
    debug: false
});

app.set('port', process.env.PORT || 3000);
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

//mySqlClient.query('SELECT * FROM `todo` WHERE `userid` = ? ORDER BY `rank` ASC, `id` ASC;', [logined_userid], function (error, rows) {
//    if (error) {
//        console.log('error : ', error.message);
//        return;
//    } else {
//        var rows_todo = [],
//            rows_doing = [],
//            rows_done = [];
//        var todo_sign = 0,
//            doing_sign = 0,
//            done_sign = 0;
//
//        for (var i = 0; i < rows.length; i++) {
//            if (rows[i].status == 1) {
//                rows_todo[todo_sign] = rows[i];
//                todo_sign++;
//            } else if (rows[i].status == 2) {
//                rows_doing[doing_sign] = rows[i];
//                doing_sign++;
//            } else if (rows[i].status == 3) {
//                rows_done[done_sign] = rows[i];
//                done_sign++;
//            }
//        }
//
//        console.log('데이터 성공적 분류함');
//        res.send(ejs.render(data, {
//            todoList: rows_todo,
//            doingList: rows_doing,
//            doneList: rows_done
//        }));
//        return true;
//    }
//});

//MainPage 라우터
router.route('/').get(function (req, res) {

    fs.readFile('./public/index.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {}));
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
        console.log('server started - port: ' + app.get('port'));
    }
);
