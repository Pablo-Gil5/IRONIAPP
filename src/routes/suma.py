
#class Sumatorio
#    _inherit = 'suma.order'

#//def sumar(a, b):
#    return a + b

import sys, json

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Dado que nuestra entrada solo tendría una línea, analice nuestros datos JSON de esa
    return json.loads(lines[0])

def main():
    # obtener nuestros datos como una matriz de read_in ()
    lines = read_in()

    # Suma de todos los elementos de la matriz proporcionada
    total_sum_inArray = 0
    for item in lines:
        total_sum_inArray += item

    #devolver la suma al flujo de salida
    print total_sum_inArray

# Iniciar proceso
if __name__ == '__main__':
    main()

'''
function llamada (frase){
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
        console.log(pythonResponse)
        return pythonResponse;

    })

    pythonProcess.stderr.pipe(process.stderr);
    

   // pythonProcess.stdin.write("backendi")
    

   // pythonProcess.stdin.end()


    //return pythonResponse;

   // res.send(pythonResponse);
}

'''