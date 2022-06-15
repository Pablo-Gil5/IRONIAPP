const { rejects } = require('assert');
const { Console } = require('console');
const express = require('express');
const { resolve } = require('path');
const internal = require('stream');
const pool = require('../database');

const router = express.Router();

const db = require('../database');

//Crear usuario

router.get('/add', (req,res) => {
    res.render('links/add');
});

router.post('/add', async (req,res) => {
    console.log(req.body);
    const {user, password} = req.body;
    const newLink = {
        username : user,
        password : password
    };

    console.log(newLink);

    await pool.query('INSERT INTO USERS SET ?',[newLink])
    res.send('hola');
});

//Login
router.get('/login', (req,res) => {
    res.render('links/login');
});

router.post('/login', async (req,res) => {
    res.render('links/game');
});

//juego
router.get('/game1', async(req,res) => {
    
    const topics = await pool.query('select * from topics');

    res.render('links/topic', {topics:topics});
});

router.get('/game2', (req,res) => {
    res.send('hola');
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

function llamada (frase){

    return new Promise((resolve,reject) =>{
        const spawn = require("child_process").spawn

        console.log("buenas")
    
        //const pythonProcess = spawn("python", ["/src/routes/script_python.py"])
        //C:\Users\pagg1\Desktop\IRONIAPP\src\routes\script_python.py
    
        const pythonProcess =  spawn("python", ["C:/Users/pagg1/Desktop/transformer/transformer.py", "que buen dia hace"])
    
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
            console.log( pythonResponse.substr(16,5) );
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


router.post('/tiempo', async (req,res) => {
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
    //console.log(res);

    console.log("Llamada a la IA");
    console.log("frase de la llamada: "+ req.body.respuesta);
    //llamada (frase);

    var resultado = await llamada(req.body.respuesta);
    console.log(resultado)
    console.log("Resultado: "||resultado)


    console.log(req.body.topic_sentence_number);
    var numero_frase =  Number(req.body.topic_sentence_number,10) + 1;
    console.log(numero_frase);
    const contenido = await pool.query('select * from sentence where topic_id ='+req.body.topic_id+ ' and topic_sentence_number ='+numero_frase);
    console.log('contenido : '+contenido + '-');

    console.log( Object.keys(contenido).length === 0 )

    if( Object.keys(contenido).length === 0){
      //  res.send('Fin del juego');
        res.render('links/final');
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