//REQUIRING NODE MODULES
const express=require('express')
const hbs=require('express-handlebars')
var bodyParser = require('body-parser')
const session=require('express-session')


const app=express();

//IMPORTING LOCAL MODULES
const adminRoutes = require('./routes/admin')
const userRouters= require('./routes/user')
const dbConnect=require('./dbconnect');

//SESSION
app.use(session({secret:"key",resave:false,saveUninitialized:true}))

app.use(function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


//STYLE LINKING
app.use(express.static(__dirname+"/public"))

dbConnect()
//VIEW ENGINE SETUP
app.engine('hbs',hbs.engine({extname:'.hbs'}))
app.set('view engine','hbs')

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))

 
//ROUTER MIDDLEWARES
app.use('/admin',adminRoutes)
app.use('/',userRouters)



 


//PORT 
app.listen(8001,console.log('server started at port number 8001'))
