console.log('filename:__'+ __filename);
console.log('dirname:__'+ __dirname);

//console 전역객체 사용
console.log('숫자: %d +%d= %d', 273, 52, 273+52);
console.log('json:%j', {name:'Hong'});
console.log('JSON:'+{name:'Hong'});
console.log('JSON:'+JSON.stringify({name:'Hong'}));

var obj= {name:'Hong'};
obj= JSON.stringify(obj); //객체->문자열
obj = JSON.parse(obj);

console.time('alpha');
var output=1;

for(var i=1; i<=10; i++){
	output *=1;
}

console.log('Result='+output);
console.timeEnd('alpha');

var module = require('./module.js');
console.log('abs(-273)=' + module.abs(-273));
console.log('circleArea(3)='+module.circleArea(3));