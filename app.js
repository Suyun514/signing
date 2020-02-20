const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');

const fs = require('fs');

let app = new Koa();

app.use(static('.'));

let router = new Router();
app.use(router.middleware());

router.post('/api/sign', ctx => {
    let info = ctx.request.query;
    
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }

    if (!fs.existsSync(`./data/${info.course}.json`)) {
        fs.writeFileSync(`./data/${info.course}.json`, '{}');
    }

    let courseJson = JSON.parse(fs.readFileSync(`./data/${info.course}.json`, 'utf8'));
    courseJson[info.name] = '';
    fs.writeFileSync(`./data/${info.course}.json`, JSON.stringify(courseJson));
});

router.get('/api/query', ctx => {
    let info = ctx.query;

    if (!fs.existsSync(`./data/${info.course}.json`)) {
        ctx.body = "课程不存在！";
        return;
    }

    let courseJson = JSON.parse(fs.readFileSync(`./data/${info.course}.json`, 'utf8'));

    ctx.body = '';
    let count = 0;
    for (let key in courseJson) {
        ctx.body += key;
        ctx.body += '<br>'

        count++;
    }

    ctx.body += `<br>共计 ${count} 人。`
});

app.listen(8888);
