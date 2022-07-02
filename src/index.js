
//Constante express que requiere el modulo express
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
//const { extname } = require('path');

//autenticacion

//const passport = require('passport');

//----------------


//Inicializar expess

const app = express();
//require("./lib/passport")

//Variable global
//app.locals.username = "Pablo";
global.sessionUsername = "Ninguno";
global.sessionID = 0;

//Settings (Configuraciones)

app.set('port',process.env.Port || 4000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'Layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//Middlewares (dev es para ver que esta llegando al server por consola)
app.use(morgan('dev')); 

app.use(session({
    secret: 'ironiApp',
    resave: false,
    saveUninitialized: false
})

)
//app.use(passport.initialize());
//app.use(passport.session());

//metodo para aceptar los datos de los formularios que tengan datos sencillos
app.use(express.urlencoded({extended:false}));

//por si se quieren aceptar json
app.use(express.json());

//Variables globales

//meter aqui variables que queremos usar en cualquier parte
app.use((req,res,next)=>{
    //app.locals.user = req.user;
    next();
});

//Rutas (URLs)
app.use(require('./routes/index.js'));
//app.use(require('./routes/authentication'));

//todas las rutas de links tienen el prefijo links
app.use('/links', require('./routes/links'));



//Archivos publicos
app.use(express.static(path.join(__dirname, 'public')));


//Empezar el servidor

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});