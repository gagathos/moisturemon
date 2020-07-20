"use strict"

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const yamlConfig = require('node-yaml-config')
const prompt = require('prompt')
const fs = require('fs')
const yaml = require('js-yaml')

var getPortsList = (callback) => {
  var portsList = [];

  SerialPort.list().then((ports) => {
    ports.forEach((port) => {
    	if (/arduino/i.test(port.manufacturer)) {
    		portsList.push(port.path);
    	}
    }, err => console.error(err));

    callback(null, portsList);
  });
};

try {
	  if (fs.existsSync(__dirname + '/config.yml')) {
	    //file exists
		console.log('Config file (config.yml) already exists. Please delete or just edit that.')
		process.exit()
	  }
	} catch(err) {
	  console.error(err)
	}
	
	
getPortsList((err, ports) => {
	var properties = [
		{   name: 'sensor_name',
			description: 'Sensor Name',
		},
	    {   name: 'send_url',
	    	description: 'Receiver URL'
	   	},
		{
	        name: 'secret',
	        description: 'Secret (for authenticating with receiver)'
	    },
	    {
	        name: 'port',
	        description: 'Serial Port ('+ports.join(' - ')+')'
	    },
	    {
	    	name: 'polling_interval',
	    	description: 'Polling interval (in seconds)'
	    }
	];
	prompt.start();

	prompt.get(properties, function (err, result) {
	    if (err) { return onErr(err); }
	    let yamlStr = yaml.safeDump(result);
	    console.log(yamlStr);
	    fs.writeFileSync(__dirname + '/config.yml', yamlStr)
	});

})

