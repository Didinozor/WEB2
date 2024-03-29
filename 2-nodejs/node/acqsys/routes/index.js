var express = require('express');
var router = express.Router();
const { SerialPort, ReadyParser, ReadlineParser, DelimiterParser } = require('serialport')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const broker = require('mqtt')
let currentSession = null;
let isRecording = false;
let latestMeasurement = '';

/*******************/
/* LA PARTIE MQTT  */
/*******************/

const mqtt = broker.connect('mqtt://kermareg.be:1883', {
    username: 'helha',
    password: 'helha'
})
const port =  '/dev/ttyACM2'

// Debug du port serial
SerialPort.list().then(ports => {
    console.log(ports)
})

const arduino = new SerialPort({
    baudRate: 9600,
    path: port
})

const parser = arduino.pipe(new ReadlineParser({delimiter: '\r\n'}))

parser.on('data', async (ligne) => {
  console.log(ligne);
  mqtt.publish("/helha/bertrand", ligne);

  // Vérifie si l'enregistrement est activé
  if (isRecording && currentSession) {
      try {
          const measure = await prisma.measure.create({
              data: {
                  time: new Date(),
                  value: parseFloat(ligne),
                  sessionId: currentSession.id,
              },
          });
          console.log('Data saved to database:', measure);
          latestMeasurement = measure;
      } catch (error) {
          console.error('Error saving data to the database:', error);
      }
  }
});

mqtt.on('connect',()=> {
    console.log('Connected');
    mqtt.subscribe('/anycubic/#')
})

mqtt.on('message',(topic, valeur) =>{
    //console.log("Received data...");
    //console.log(topic + '\t' + valeur.toString());
})

/*******************/
/* LA PARTIE HTML  */
/*******************/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { });
});

/* GET historique page */
router.get('/historique', function(res, res, next){
  res.render('historique', { });
})

async function startSession() {
  currentSession = await prisma.session.create({
    data: {
      name: new Date(),
    },
  });
}

router.post('/start', async (req, res) => {
  if (!currentSession) {
      try {
          await startSession();
          isRecording = true;
          res.json({ status: 'Recording started' });
      } catch (error) {
          console.error('Error starting session:', error);
          res.status(500).json({ error: 'Failed to start recording' });
      }
  } else {
      res.json({ status: 'Recording already started' });
  }
});

router.post('/stop', (req, res) => {
  isRecording = false;
  currentSession = null;
  res.json({ status: 'Recording stopped' });
});

router.get('/realtime-measurements', async (req, res) => {
  res.send(latestMeasurement);
});

module.exports = router;
