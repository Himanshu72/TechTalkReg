var express = require('express');
var validator = require('validator');
var mysql=require("mysql");
var router = express.Router();

var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  port:3306,
  user : 'TUKN9qkrxO',
  password : 'b6JQaYWxLn',
  database : 'TUKN9qkrxO'
});





function handleDisconnect() {
 connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}





let BCAC=0;
let IMC=0;
let BCA=70;
let IM=22;
let all=0;

/* GET home page. */
connection.query("SELECT COUNT (ID) as 'COUNT' FROM users ;", function (err, results, fields) {
  if(results.length>0){
    
    all=results[0].COUNT;
  }
});

connection.query("SELECT COUNT (ID) as 'COUNT' FROM users where UserID LIKE '1%' ;", function (err, results, fields) {
  if(results.length>0){
    console.log("BCA COUNT",results[0].COUNT);
    BCAC=results[0].COUNT;
  }
});

connection.query("SELECT COUNT (ID) as 'COUNT' FROM users where UserID LIKE '2%' ;", function (err, results, fields) {
  if(results.length>0){
    console.log("BCA COUNT",results[0].COUNT);
    IMC=results[0].COUNT;
  }
});




router.get("/delete:id",function(req,res){
  
  const id=req.params.id.substring(1);
//UPDATE `users` SET `ID` = ID + 100 WHERE `users`.`ID` = 1 ;  
connection.query("UPDATE `users` SET `ID` = ID + 100 WHERE `users`.`ID` = "+id+";", function (err, results, fields) {

  console.log(results);

  res.render("search",{err:false,scc:false,msg:"",lname:"",fname:"",id:""});

});



})








router.get("/capacity",function(req,res)
{
  res.write("BCA:"+BCAC+",IM:"+IMC );
  res.end();
});

router.get("/sid",function(req,res){
  res.render("searchbyid",{err:false,scc:false,msg:"",lname:"",fname:"",id:""});
  });
  router.post("/sid",function(req,res){
    let {Year,rollno,section,clas}=req.body;
    let id=clas+Year+section+rollno;
    console.log(id)
    
    if(Year!="" && rollno!="" && section!="" && clas!="" )
    {
      
    connection.query("SELECT Fname,Lname,ID  FROM `users`  where UserID="+id+";", function (err, results, fields) {
  
      if (err) {
        res.render("searchbyid",{err:true,scc:false,msg:"something went wrong",lname:"",fname:"",id:""});
      }
    
      
      if(results.length > 0 )
      {
      console.log(results[0].Fname);
      res.render("searchbyid",{err:false,scc:true,msg:"",lname:results[0].Lname,fname:results[0].Fname,id:results[0].ID});
     
      }else{
        console.log("empty");
        res.render("searchbyid",{err:true,scc:false,msg:"no data found",lname:"",fname:"",id:""});
      }
    })
    

  }
  
  })





router.get("/search",function(req,res){
  res.render("search",{err:false,scc:false,msg:"",lname:"",fname:"",id:""});
  });
  
  
  router.post("/search",function(req,res){
    
  const id=req.body.search;
  if(id)
  {
    
  connection.query("SELECT Fname,Lname  FROM `users`  where ID="+id+";", function (err, results, fields) {
  
    if (err) {
      res.render("search",{err:true,scc:false,msg:"something went wrong",lname:"",fname:"",id:""});
    }
  
    
    if(results.length > 0 )
    {
    console.log(results[0].Fname);
    res.render("search",{err:false,scc:true,msg:"",lname:results[0].Lname,fname:results[0].Fname,id:id});
   
    }else{
      console.log("empty");
      res.render("search",{err:true,scc:false,msg:"no data found",lname:"",fname:"",id:""});
    }
  })
  
  
  }
  
   // res.render("search",{err:false,scc:false,msg:"",lname:"",fname:"",id:""});
    });


    
  


function getCount(){
  
var c;

return c;
}


getCount();
  
  

function idTODetails(id){
let a=new Array(4);
  if(id[0]=="1"){
    a[0]="BCA"
}
else{
a[0]="MSCIT"
}

if(id.substring(1, 5)=="2017"){
  a[1]="TY"
}else if(id.substring(1, 5)=="2018"){
  a[1]="SY"
}else{
  a[1]="FY"
}

if(id[5]=="1"){
a[2]="A";
}else if(id[5]=="2"){
  a[2]="B";
}
else{
  a[2]="C";
}

a[3]=id.substring(6)
return a;
}




router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/come",function(req,res){
let push=[];

  connection.query("SELECT *  FROM `users`  where ID > 100  ", function (err, results, fields) {
    //console.log(results);
    if(results.length > 0){
     
      for(let ele of results){
        let a=idTODetails(ele.UserID.toString());
          
          //console.log(ele.UserID);
        push.push({fname:ele.Fname,lname:ele.Lname,a:a})        
      }

      res.render("come",{results:push,check:true,msg:"Present"});
    }else{
      res.render("come",{results:push,check:false,msg:"Present"});  
    }
    
  
  
  });

});

router.get("/notcome",function(req,res){
  connection.query("SELECT *  FROM `users`  where ID <= 100  ", function (err, results, fields) {
    if(results.length > 0){
     let push=[];
      for(let ele of results){
        let a=idTODetails(ele.UserID.toString());
          
          //console.log(ele.UserID);
        push.push({fname:ele.Fname,lname:ele.Lname,a:a})        
      }

      res.render("come",{results:push,check:true,msg:"Absent"});
    }else{
      res.render("come",{results:push,check:false,msg:"Absent"});  
    }
  });
})

router.get("/register",function(req,res){
  res.render("register",{ check:false,type:"",msg:"",swal:false,id:""});
})

router.post("/register",function(req,res){
  let users;






 let  {fname,Lname,email,Year,rollno,section,clas }=req.body;
  //console.log(fname,Lname,email,Year,rollno,section,clas);
  
  let ID=clas+Year+section+rollno;
          


  if(fname=="" || Lname=="" || email=="" || Year=="" || section=="" || clas=="" ){
    res.render("register",{ check:true,type:"alert-danger",msg:"Please insert All value",swal:false,id:""})
    return;
  }

if(Year!="2017" &&  Year!="2018" && Year!="2019"){
  res.render("register",{ check:true,type:"alert-danger",msg:"invalid year",swal:false,id:""});
  return;

}

if(!validator.isEmail(email)){
  res.render("register",{ check:true,type:"alert-danger",msg:"invalid Email",swal:false,id:""});
  return;
} 

if(section!="1" && section!="2" && section!="3" ){
  res.render("register",{ check:true,type:"alert-danger",msg:"invalid Section",swal:false,id:""});
  return;

}

if(clas!="1" && clas!="2"){

  res.render("register",{ check:true,type:"alert-danger",msg:"invalid Course",swal:false,id:""});
  return;


}



connection.query("SELECT * FROM `users`", function (err, results, fields) {
  if (err) {
    return console.log(err);
  }

 console.log(results);
   users=results;

   for(let item of users){
    if(item.UserID==ID){
      res.render("register",{ check:true,type:"alert-danger",msg:"You are already Register",swal:false,id:""})
      return;
    }
    if(item.Email==email){
      res.render("register",{ check:true,type:"alert-danger",msg:"this email Already Register",swal:false,id:""})
      return;
    }
  
  }
  




  });
 



if(clas==1){
  
  if(BCA<=BCAC){
    res.render("register",{ check:true,type:"alert-danger",msg:"Registration are Over",swal:false,id:""})
    return;
  }
    
}else{
  

  if(IM<=IMC)
  {
    res.render("register",{ check:true,type:"alert-danger",msg:"Registration are Over",swal:false,id:""})
    return;
  }
  
}
    
  


all++;

connection.query("INSERT INTO `users` (`UserID`, `ID`, `Fname`, `Lname`, `Email`  ) VALUES ('"+ID+"', '"+all+"', '"+fname+"', '"+Lname+"', '"+email+"');", function (err, results, fields) {
  if (err) {
    res.render("register",{ check:true,type:"alert-danger",msg:"Some thing Went Wrong",swal:false,id:""});
    all--;
   
    return console.log(err);
    
  }

  if (results) { 
    


    res.render("register",{ check:true,type:"alert-success",msg:"successfully registered",swal:true,id:all});
    switch(clas){
      case "1":
         BCAC++;
         break;
      case "2":
        IMC++;
        break;
    }
    
    return;

  }
 
});



 
});


module.exports = router;
  