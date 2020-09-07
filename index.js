const Koa = require('koa');
const app = new Koa();
require('dotenv').config()
const router = require('./router')

app.use(require('koa-body')());

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`Url :: ${ctx.url}, Time: ${ms}ms`)
});

app.use(async (ctx, next) => {
    try {
        await next()
        ctx.status = ctx.status || 200
    } catch (e) {
        console.error(e)
        ctx.status = e.status || 400
        ctx.body = {
            error: {
                name: e.name,
                message: e.message
            }
        }
    }
});

app.use(router.routes())
app.listen(process.env.PORT || 4001);
console.log('Manage server is running on ', process.env.PORT || 4001)
