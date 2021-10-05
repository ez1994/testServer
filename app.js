const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  // 要加postmand才打的到
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));  // 要加postmand才打的到

//----------------------------------------
function LogTime() {

    var Nowdate = new Date(getTaipeiDate());
    var year = Nowdate.getFullYear(); // 年
    var month = (Nowdate.getMonth() + 1 < 10 ? '0' : '') + (Nowdate.getMonth() + 1); // 月
    var day = (Nowdate.getDate() + 1 < 10 ? '0' : '') + Nowdate.getDate(); // 日
    var hour = (Nowdate.getHours() < 10 ? '0' : '') + Nowdate.getHours(); // 時
    var minute = (Nowdate.getMinutes() < 10 ? '0' : '') + Nowdate.getMinutes(); // 分
    var second = (Nowdate.getSeconds() < 10 ? '0' : '') + Nowdate.getSeconds(); // 秒
    return '[' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + ']  ';
}
function getTaipeiDate() {
    // Option          Values          Sample output
    // ----------------------------------------------------
    // weekday         'narrow'        'M'
    //                 'short'         'Mon'
    //                 'long'          'Monday'

    // year            '2-digit'       '01'
    //                 'numeric'       '2001'

    // month           '2-digit'       '01'
    //                 'numeric'       '1'
    //                 'narrow'        'J'
    //                 'short'         'Jan'
    //                 'long'          'January'

    // day             '2-digit'       '01'
    //                 'numeric'       '1'

    // hour            '2-digit'       '12 AM'
    //                 'numeric'       '12 AM'

    // minute          '2-digit'       '0'
    //                 'numeric'       '0'

    // second          '2-digit'       '0'
    //                 'numeric'       '0'

    // timeZoneName    'short'         '1/1/2001 GMT+00:00'
    //                 'long'          '1/1/2001 GMT+00:00'

    var options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,    // 24 小時制
        timeZone: 'Asia/Taipei',
    };

    const taipei = new Date().toLocaleString('zh-TW', options);

    return taipei;
}
//----------------------------------------

app.listen(PORT, () => {
    console.log(LogTime() + "port: " + PORT + " success");
});

app.get("/", function (req, res) {
    res.send(`welcome to azure gtlich`);
    res.end();
});


setInterval(() => {

    let browser;
    (async () => {
        try {
            console.log("=============================================================")
            console.log("start touch")

            url = `https://ez-one.glitch.me`;

            const browser = await puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io/' });

            // browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();

            // networkidle2 会一直等待，直到页面加载后同时没有存在 2 个以上的资源请求，这个种状态持续至少 500 ms
            const response = await page.goto(url, { "waitUntil": "networkidle0" });

            // 回傳response是否為成功
            // console.log(response.ok());

            console.log(`${LogTime()} touch ${url}`);

            // 回傳response的 remote server，包含IP和port
            console.log('responseremoteAddress: ', response.remoteAddress());

            // 回傳response的body
            const responseData = await response.text();
            console.log(`responseData: ${responseData}`);

            // 回傳response的狀態，成功是200
            console.log(`status: ${response.status()}`);


        } catch (e) {
            console.log(e);
        } finally {
            await browser.close();
            console.log("touch end");
            console.log("=============================================================")
        }

    })();

    //---------------------------------

}, 1 * 10 * 1000);



//---------------------------------

//Add headers
app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://XX.XXX.XXX.XXX:XXXX');
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    //Set to true if you need the website to include cookies in the requests sent
    //to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    //Pass to next layer of middleware
    next();
});
