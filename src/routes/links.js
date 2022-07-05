const { rejects } = require('assert');
const { Console } = require('console');
const express = require('express');
const { resolve } = require('path');
const internal = require('stream');
const pool = require('../database');

const router = express.Router();

const passport = require('passport');
const helpers =  require('../lib/helpers');

const db = require('../database');
const { serializeUser } = require('passport');
const bcrypt2 = require('bcryptjs');
//Crear usuario

router.get('/add', (req,res) => {
    res.render('links/add');
});

router.post('/add', async (req,res) => {

  /*passport.authenticate('local.signup',{
       successRedirect: '/links/ok',
       failureRedirect: '/links/add',
      failureFlash: true
    });

    res.send('received');
*/
    var error = "";
    
    console.log(req.body);
    const {user, password} = req.body;
    var contrasenya  = await helpers.encryptPassword(password);
    const newLink = {
        username : user,
        password : contrasenya
    };

    console.log(newLink);
    //app.locals.username = "Pablo";
   // console.log("Username: "+ globalUsername);

    //globalUsername = "Ninguno"; 

    //console.log("Username 2: "+globalUsername);
    console.log("Username: "+sessionUsername);
    console.log("sessionID: "+sessionID);

    //Validar los datos introducidos
    const usuarios = await pool.query('SELECT * FROM users WHERE username=?',[user]);

    if (usuarios.length >0){
        error= 'Ya existe un usuario con ese nombre';
        console.log('Ya existe un usuario con ese nombre');
        //res.send('Error');
        res.render('links/add_error',{error:error});
    }
    else{
        if(password.length < 7){
            error= 'Constraseña demasiado corta';
            console.log('Constraseña demasiado corta');
            //res.send('Error');
            res.render('links/add_error',{error:error});
        }
        else{
            const result = await pool.query('INSERT INTO USERS SET ?',[newLink]);
            console.log(result);
            var userID = result.insertId;
            sessionID = userID;
            sessionUsername = user;
            console.log("Username: "+sessionUsername);
            console.log("sessionID: "+sessionID);
            //serializeUser(userID);
            //res.send('hola');
            console.log("Registro correcto");
            res.render('links/game');
        }
    }
    
});

/*
passport.serializeUser((id) =>{
    console.log("Hola");
});

passport.deserializeUser(async (id, done)=>{
    const rows = await pool.query('SELECT * FORM USERS WHERE ID = ?',[id]);
    done(null, rows[0]);
});
*/

router.get('/ok', (req,res) => {
    res.send('hola');
});

//Login
router.get('/login', (req,res) => {
    res.render('links/login');
});

router.post('/login', async (req,res) => {
    const {user, password} = req.body;
    const usuarios = await pool.query('SELECT * FROM users WHERE username=?',[user]);
    console.log(usuarios);
    console.log(usuarios[0]);
    console.log(usuarios[0].password);
    var pass = usuarios[0].password;
    var id = usuarios[0].id
    var nombre = usuarios[0].username;
    console.log(pass);
    if(usuarios.length =0){
        res.send('No existe el usuario');
    }
    else{
        console.log("req.body.password "+ req.body.password);
        console.log("usuarios[0].password " + pass);
        var l = await helpers.encryptPassword(req.body.password);
        console.log("l "+ l);
        //const validPassword = await helpers.matchPassword(req.body.password, pass);
        const valido = await bcrypt2.compare(req.body.password, pass);
        console.log("valido" + valido);
        console.log(valido);
        if(valido){
            console.log("Contraseña valida");
            sessionID = id;
            sessionUsername = nombre;
            res.render('links/game');
        }
        else{
            console.log('Id del usuario: '+ id);
            res.render('links/login_error');
        }
    }

});

//Menu de juego
router.get('/game', async(req,res) => {
    
    res.render('links/game');
});

//juego
router.get('/game1', async(req,res) => {
    
    const topics = await pool.query('select * from topics');

    res.render('links/topic', {topics:topics});
});

//Top puntuaciones
router.get('/games', async(req,res) => {
    
    const games = await pool.query('select * from game where points is not null order by points desc');

    console.log(games[0].user_id);
    console.log(games[0].id);
    console.log(games[0].points);

    //jugador 1
    const jugador1 = {
        user : games[0].user_id,
        id : games[0].id,
        points: games[0].points
    };

    //jugador 2
    const jugador2 = {
        user : games[1].user_id,
        id : games[1].id,
        points: games[1].points
    };

    //jugador 3
    const jugador3 = {
        user : games[2].user_id,
        id : games[2].id,
        points: games[2].points
    };   
    
    //jugador 4
    const jugador4 = {
        user : games[3].user_id,
        id : games[3].id,
        points: games[3].points
    };

    //jugador 5
    const jugador5 = {
        user : games[4].user_id,
        id : games[4].id,
        points: games[4].points
    };

    res.render('links/top_games', {games:games,jugador1:jugador1,jugador2:jugador2,jugador3:jugador3,jugador4:jugador4,jugador5:jugador5});
});


router.get('/game2', (req,res) => {
    res.render('links/imagen');
   // res.send('hola');
});

//temas
router.get('/game2', (req,res) => {
    res.render('links/topic');
});


router.get('/usuarios', async (req,res)=>{
    const users = await pool.query('select * from users');

  //  console.log(users);
  //  res.send('Los usuarios iran aquí');

    res.render('links/users', {users:users});



});

router.get('/frase', async (req,res)=>{
   // const users = await pool.query('select * from users');

  //  console.log(users);
  //  res.send('Los usuarios iran aquí');

    res.render('links/frase');
});

//llamada(req.body.respuesta, req.body.num_partida, req.topic_sentence_number, req.topic_id)

function llamada (frase, num_partida, topic_sentence_number, topic_id){

    async function insertar (answer){
        console.log("Inserto frase");
        await pool.query('INSERT INTO ANSWER SET ?',[answer]);
        console.log("Frase insetada");
    };

    console.log("Frase: " +frase);
    console.log("num_partida: " +num_partida);
    console.log("topic_sentence_number: " +topic_sentence_number);
    console.log("topic_id: " +topic_id);

    return new Promise((resolve,reject) =>{
        const spawn = require("child_process").spawn

        console.log("buenas")
    
        //const pythonProcess = spawn("python", ["/src/routes/script_python.py"])
        //C:\Users\pagg1\Desktop\IRONIAPP\src\routes\script_python.py
    
        //const pythonProcess =  spawn("python", ["C:/Users/pagg1/Desktop/transformer/transformer.py", "que buen dia hace"])
        const pythonProcess =  spawn("python", ["C:/Users/pagg1/Desktop/transformer/transformer.py", frase])

        let pythonResponse = ""
    
        pythonProcess.stdout.on("data", function(data){
            console.log("Hola")
            pythonResponse += data.toString()
            //return pythonResponse;
        })
    
        pythonProcess.stdout.on("end",function(){
            console.log("Hola1")
            console.log(pythonResponse['non-ironic'])
            console.log(pythonResponse["non-ironic"])
            console.log(pythonResponse)
            console.log(typeof(pythonResponse))
            //return pythonResponse;
            console.log( pythonResponse.substr(47,5) );
            var posicion = pythonResponse.indexOf("'ironic'");
            console.log();
            var cadena_recortada = pythonResponse.substr(posicion,20);
            console.log("cadena_recortada: "+cadena_recortada);
            var cadena_numero = cadena_recortada.substr(10,4);
            console.log("cadena_numero "+ cadena_numero);
            console.log((pythonResponse.substr(47,5)));
            //console.log(parseFloat(pythonResponse.substr(15,5)));
            var puntos = parseFloat(cadena_numero) * 100;
            console.log("Puntos: "+puntos);

            //Insertar la puntuacion

            const newAnswer = {
                content : frase,
                user_id : 1,
                game_id : num_partida,
                topic_id : topic_id,
                topic_sentence_number : topic_sentence_number,
                points : puntos
            };
        
            console.log(newAnswer);
        
            insertar(newAnswer);
            
            //----------------------


            resolve(pythonResponse)
        })
    
        pythonProcess.stderr.pipe(process.stderr);
    })

   
    

   // pythonProcess.stdin.write("backendi")
    

   // pythonProcess.stdin.end()


    //return pythonResponse;

   // res.send(pythonResponse);
}

function hola(){
    eel.expose(say_hello_js);               // Expose this function to Python
        function say_hello_js(x) {
            console.log("Hello from " + x);
        }

        say_hello_js("Javascript World!");

        eel.say_hello_py("Javascript World!");  // Call a Python function
}

router.post('/frase', async (req,res) => {
    console.log(req.body);
    const {frase} = req.body;
    const newLink = {
        respuesta : frase,
    };

    console.log(newLink);

    //await pool.query('INSERT INTO USERS SET ?',[newLink])

   // let resultado;

    resultado = await llamada("buenas tarde");

   // res.send(resultado);
   console.log(resultado)
    console.log("Resultado: "||resultado)

    res.send(resultado);

    //Otra pueba

   // var spawn = require("child_process").spawn;

//	var process  = spawn('python',["./hello.py","pepe", "juan"]);

//	process.stdout.on('data',function(data){
//		res.send(data.toString());
//	});
});

router.get('/name', callName); 
function callName(req, res) { 
      
    var spawn = require("child_process").spawn; 
    
    var process = spawn('python',["./hello.py", 
                            req.query.firstname, 
                            req.query.lastname] ); 
    
    process.stdout.on('data', function(data) { 
        res.send(data.toString()); 
    } ) 
} 

//Llamadas del menu de inico

router.post('/menu1', async (req,res) => {

    res.send('hola1');
});

router.post('/menu2', async (req,res) => {

    res.send('hola2');
});


//LLamadar a un tema concreto

router.post('/oracion', async (req,res) => {
    console.log(req.body);
    
    res.send('hola mundo');
});


router.post('/colores', async (req,res) => {

    const newLink = {
        user_id : 1
    };

    console.log(newLink);

    await pool.query('INSERT INTO GAME SET ?',[newLink])

    const max = await pool.query('select * from game where id in (select max(id) from game)');
    const fila= max[0];
    const num_partida = fila.id;
    console.log('Fila : ');
    console.log(num_partida);
    console.log('-------');

    const contenido = await pool.query('select * from sentence where topic_id ='+2+ ' and topic_sentence_number ='+1);

    res.render('links/tiempo', {contenido:contenido, num_partida : num_partida });
});

router.post('/tiempo', async (req,res) => {
    console.log("BODY");
    console.log(req.body);
    
    //res.send('hola mundo');

    const newLink = {
        user_id : 1
    };

    console.log(newLink);

    await pool.query('INSERT INTO GAME SET ?',[newLink])

    const max = await pool.query('select * from game where id in (select max(id) from game)');
    const fila= max[0];
    const num_partida = fila.id;
    console.log('Fila : ');
    console.log(num_partida);
    console.log('-------');

    const contenido = await pool.query('select * from sentence where topic_id ='+1+ ' and topic_sentence_number ='+1);

    //const count = await pool.query('select * from sentence where id select max(topic_sentence_number) from sentence where topic_id ='+1);
   // const count = await pool.query('select count(*) from sentence where topic_id ='+1);
   // console.log('Count : ');
   // console.log(count[0]);
   // console.log('-------');
   // const num_frases = JSON.parse(JSON.stringify(count));  

   // console.log(num_frases);

    //  console.log(users);
    //  res.send('Los usuarios iran aquí');
  
      res.render('links/tiempo', {contenido:contenido, num_partida : num_partida });
});

router.post('/siguiente', async (req,res) => {
    console.log(req.body);
    console.log("num_partida"+ req.body.num_partida);
    console.log("num_partida"+ req.topic_sentence_number);
    //console.log(res);

    console.log("Llamada a la IA");
    console.log("frase de la llamada: "+ req.body.respuesta);
    //llamada (frase);

    var resultado = await llamada(req.body.respuesta, req.body.num_partida, Number(req.body.topic_sentence_number,10), Number(req.body.topic_id ,10));
    console.log(resultado)
    console.log("Resultado: "||resultado)


    console.log(req.body.topic_sentence_number);
    var numero_frase =  Number(req.body.topic_sentence_number,10) + 1;
    console.log("numero_frase" + numero_frase);
    const contenido = await pool.query('select * from sentence where topic_id ='+req.body.topic_id+ ' and topic_sentence_number ='+numero_frase);
    console.log('contenido : '+contenido + '-');

    console.log( Object.keys(contenido).length === 0 )

    if( Object.keys(contenido).length === 0){
      //  res.send('Fin del juego');
        console.log("num_partida: " + req.body.num_partida);

        const tema = await pool.query('select * from sentence where topic_id ='+req.body.topic_id);
        var contenido2 = await pool.query('select * from answer where game_id ='+req.body.num_partida);

        while(contenido2.length < 4){
            contenido2 = await pool.query('select * from answer where game_id ='+req.body.num_partida);
        }

        console.log(contenido2);

        var puntuacion_media = 0;
        var total_frases = 0;
        //const max = await pool.query('select * from game where id in (select max(id) from game)');
        for (var k = 0; k < contenido2.length; k ++ ){
            var fila= contenido2[k];
            puntuacion_media = puntuacion_media + fila.points;
            total_frases ++;
        }
        //const fila= max[0];
        //const num_partida = fila.id;
        console.log("puntuacion_media" + puntuacion_media);
        puntuacion_media = Math.trunc(puntuacion_media/total_frases);
        console.log("puntuacion_media" + puntuacion_media);

        await pool.query('update game set points = '+ puntuacion_media + ' where id ='+req.body.num_partida);

        res.render('links/final', {num_partida : req.body.num_partida, contenido: contenido2,  tema:tema,puntuacion_media:puntuacion_media});
    }
    else{
        
    console.log('Hola mundo');
    //res.send('Hola mundo');

    console.log(req.body.num_partida);
    const num_partida = req.body.num_partida;
    console.log(num_partida);

    res.render('links/tiempo', {contenido:contenido, num_partida : num_partida});
    }
    
    /**
     *     if(typeof(contenido) ==='object' && contenido !== null && contenido !== ''){
        console.log('Objeto');
    }
    else{
        console.log('No es un objeto')
    }
     */


});


module.exports = router;