const { SerialPort, ReadyParser, ReadlineParser, DelimiterParser } = require('serialport')
const broker = require('mqtt')
const mqtt = broker.connect('mqtt://kermareg.be:1883', {
    username: 'helha',
    password: 'helha'
})
const port =  '/dev/ttyACM0'

// Debug du port serial
SerialPort.list().then(ports => {
    console.log(ports)
})

const arduino = new SerialPort({
    baudRate: 9600,
    path: port
})

/*arduino.on('data', (data) => {
    const lu = Number(data.toString)
    console.log(lu);
})*/

const parser = arduino.pipre(new ReadlineParser({delimiter: '\r\n'}))

parser.on('data',(ligne) => {
    console.log(ligne);
    mqtt.publish("/helha/bertrand", ligne)
})

mqtt.on('connect',()=> {
    console.log('Connected');
    mqtt.subscribe('/anycubic/#')
})

mqtt.on('message',(topic, valeur) =>{
    console.log("Received data...");
    console.log(topic + '\t' + valeur.toString());
})
