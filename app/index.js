const Koa=require('koa');
const routing=require('./routes');

const koaBody=require('koa-body'); 
const koaStatic=require('koa-static');
const jsonError=require('koa-json-error');
const parameter=require('koa-parameter');
const mongoose=require('mongoose');
const path=require('path');
const {connectionSrt}=require('./config');
const app=new Koa();


//mongoose connent mongodb database
mongoose.connect(
    connectionSrt,
    { useNewUrlParser: true , useUnifiedTopology: true} ,
    ()=>console.log('mongodb connected success')
);
//catch error of connection in mongoose
mongoose.connection.on('error',console.error);

//put files type generate url with https format
app.use(koaStatic(path.join(__dirname,'public')));

//catch error jsonType（404 also catch）
app.use(jsonError({
    postFormat:(e,{statck,...rest})=>process.env.NODE_ENV ==='production'?rest:{statck,...rest}
}));

app.use(koaBody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'/public/uploads'),
        keepExtensions:true
    }       
}));

app.use(parameter(app));

app.use(async(ctx,next)=>{
    try{
      await next();
    }catch(err){
        ctx.status=err.status  || err.statusCode || 500;
        //support throw error(400,412 ect) and running message(500)
        ctx.body={
            message:err.message
        }
    }
});
routing(app);
app.listen(3000,
    ()=>console.log('httpServer is running at 3000 port')
);