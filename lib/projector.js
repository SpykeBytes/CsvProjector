#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var csvToJson = require('csvtojson');
var Converter = csvToJson.core.Converter;
var profiles = require('./profiles/profiles');
	
function projectToJson(fileName, profileName) {

	var cwd = process.cwd();

	var csvFileName = path.join(cwd, fileName);

	if (!profiles[profileName]) {
		console.error('Must specify a mutation within: ' + JSON.stringify(profiles));
		return;
	}

	var readStream = fs.createReadStream(csvFileName);
	var saveAs = csvFileName.replace('.csv', '.json');

	var openNewArrayFile = function () {
		fs.writeFileSync(saveAs, '[' + '\n');
	};

	var setupJsonLineItem = function (jsonItem, isLastLine) {
		
		var endOfLine = '\n';  
		
		if (!isLastLine)
			endOfLine = ',' + endOfLine;
		
		return JSON.stringify(jsonItem) + endOfLine;
	};

	var appendTextToFile = function (text) {
		fs.appendFileSync(saveAs, text);
	};

	var closeArrayFile = function () {
		fs.appendFileSync(saveAs, ']');
	};

	var csvConverter=new Converter({constructResult:false});

	var batchText = '';
	var batchRecordCount = 0;
	var mutate = profiles[profileName].createRecordMutator();

	var appendTextAndClearBatch = function () {
		appendTextToFile(batchText);
		batchText = '';
		batchRecordCount = 0;
	};

	csvConverter.on('record_parsed',function(record){
		
		mutate(record);
		
		if (batchRecordCount < 50) {
			batchText = batchText + setupJsonLineItem(record);
			batchRecordCount++;
		}
		else {
			appendTextAndClearBatch();
		}
	});
	 
	csvConverter.on('end_parsed',function(){
		
		appendTextAndClearBatch();
			
		var metadataText = '';
		var metadata = profiles[profileName].getMetadata();
		
		for (var i = 0; i < metadata.length; i++) {
			
			var isLastLine = i === metadata.length - 1;
			
			metadataText = metadataText + setupJsonLineItem(metadata[i], isLastLine);
		}
		
		appendTextToFile(metadataText);
		
		closeArrayFile();
		
		console.log('File finished: ' + saveAs);
	});
	 
	console.log('Beginning creation of file...');
	openNewArrayFile();
	readStream.pipe(csvConverter);
}

//TODO: move below this line to the bin, and figure out why it doesn't work

var docopt = require('docopt');

var doc = [
  'Usage:',
  '  projecto <file> <mutation-profile>',
  '  projecto (--help | --version)',
  '',
  'Options:',
  '  --help       Show this text',
  '  --version    Show CsvProjector version info',
].join('\r\n');

var args = docopt.docopt(doc, {
  help: true,
  version: 'projecto ' + require('../package.json').version,
});

var fileName = args['<file>'];
var profileName = args['<mutation-profile>'];

projectToJson(fileName, profileName);