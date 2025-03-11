const fs = require('fs');
const path = require('path');
const http = require('http');
const { log } = require('console');

//http.createServer((req,res) =>  {
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end('hello world');
//}).listen(3000);

const filePath = path.join(__dirname,'hello.txt');


console.log(filePath);



function createFile(){
    fs.writeFileSync('hello.txt','hello world');
}

function readFile(){
    const data = fs.readFileSync('hello.txt','utf8');
    console.log(data);
    
}
createFile();
readFile();
