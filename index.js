"use strict"

const fs = require('fs')
const request = require('request')
const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const yaml = require('js-yaml')
var stored_readings = [];
//check if config exists


try {
  if (fs.existsSync(__dirname + '/config.yml')) {
    //file exists
  } else {
	console.log('Please run configure.js or add config.yml')
	process.exit()
  }
} catch(err) {
  console.error(err)
}

try {
    let fileContents = fs.readFileSync(__dirname + '/config.yml', 'utf8');
    var config = yaml.safeLoad(fileContents);
} catch (e) {
    console.log(e);
}

const port = new SerialPort(config.port, { baudRate: 9600})
const parser = port.pipe(new Readline({ delimiter: '\n'}))

var requestReading = (() => {
	 port.write('g'); //just send one character to get a response from the sensor
	 console.log('Requesting readout');
})

parser.on('data', data =>{
  console.log('Moisture level:', data);
  let item = {ts: Date.now(), moisture: data.trim()}
  stored_readings.push(item);
  let payload = {items: stored_readings, config: config}
  request.get({
      url: config.send_url,
      qs: {payload:  JSON.stringify(payload).toString('base64')},
    }, (err, result) => {
    	console.log(result.body)
      let response = JSON.parse(result.body)
      if(response.ok == 'ok') {
    	  stored_readings = []; //clear stored readings queue
      }
      if(err ){//|| !response.ok) {
    	//failure
    	  console.log('Error sending to remote server');
      } 
  })
});

setInterval(requestReading, config.polling_interval * 1000)