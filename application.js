#!/usr/bin/node
const http=require('http'),
      url=require('url'),
      fs=require('fs'),
      qs=require('querystring'),
      log=console.log;
var cpList=JSON.parse(('./js/data.js','utf8'));
var user=[{username:'abc',password:'abc'},{username:'xz',password:'abc'}];
http.createServer((req,res)=>{
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');
  if(req.method==='GET'){
    getH(req,res);
  }else if(req.method==='POST'){
    retH(req,res);
  }else{
    process.exit();
  }
}).listen(8083);
function getH(req,res){
  var file=_dirname;
  if(req.url==='/listmanager/bg.jpg'){
    log(req.url);
  }
  if(req.url==='/list/'){
    file+='/chapterList.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode=404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url==='/login/'){
    file+='/login.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode=404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url==='/listmanager'){
    file+='/list.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode=404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(res.url==='/addChapter/'){
    file+='addChapter.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode=404;
        res.end(data);
      }
    })
  }else if(req.url.split('?')[0]==='/detail'){
    file+='/chapter.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode=404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url!=='/'){
    let listurl=req.url.split('?')[0];
    let listurls=listurl.split('/');
    for(var i=1;i<listurls.length;i++){
      if(listurls[i]==='list'||listurls[i]==='login'||listurls[i]==='listmanager'||listurls[i]==='addChapter')
        continue;
      else
        file=file+'/'+listurls[i];
    }
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode=404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/css'});
        res.end(data);
      }
    })
    if(req.url==='/getDetail'){
      var index=qs.parse(req.headers.referer.split('?')[1]).chapterId-1;
      res.writeHead(200,{'Content-Type':'text/json'});
      res.end(JSON.stringify(chapterList));
    }
}
function retH(req,res){
  var data='';
  if(req.url=='/login/'){
    req.on('data',(chunk)=>{
      data+=chunk;
    });
    req.on('end',()=>{
      data=JSON.parse(data);
      userList.forEach((userlist)=>{
        if(userlist.username===data.username && userlist.password===data.password){
          res.statusCode=200;
          res.end('OK');
        }else{
          res.statusCode=200;
          res.end('no');
        }
      });
    })
  }
  if(req.url ==='/add'){
    var newlist={};
    var data='';
    req.addListener('data',function(postdata){
      data+=postdata;
      var postdatas=qs.parse(data);
      var title=postdatas.title;
      var content=postdatas.content;
      newlist.chapterId=chapterList.length+1;
      newlist.chapterName=title;
      newlist.imgPath='images/1442457564979540.jpeg';
      newlist.chapterDes=content;
      newlist.chapterContent=content;
      newlist.publishTimer='2019-08-19';
      newlist.author='admin';
      newlist.views=1022;
      chapterList.push(newlist);
      process.on('SINGINT',()=>{
        fs.writeFileSync('./js/data.js',JSON.stringify(chapterList));
      })
    });
  }

