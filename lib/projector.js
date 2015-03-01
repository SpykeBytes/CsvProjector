var csvToJson = require("csvtojson");
var Converter = csvToJson.core.Converter;
//var parserMgr = csvToJson.core.parserMgr;
var fs=require("fs");
 
console.log(__dirname);

var csvFileName="../sample-files/playlist-sample.csv";
var fileStream=fs.createReadStream(csvFileName);

//parserMgr.addParser("dateColumnParser",/^\*date\*/,function (params){
//   var columnTitle=params.head; //params.head be like: *parserRegExp*ColumnName; 
//   var fieldName=columnTitle.replace(this.regExp, ""); //this.regExp is the regular expression above. 
//   params.resultRow[fieldName]="Hello my parser"+params.item;
//});

var param={};
var csvConverter=new Converter(param);
 
//end_parsed will be emitted once parsing finished 
csvConverter.on("end_parsed",function(jsonObj){
	
	//save the new file here
	var saveAs = csvFileName.replace(".csv", ".json");
	
	fs.writeFile(saveAs, jsonObj);
	
});
 
//read from file 
fileStream.pipe(csvConverter);