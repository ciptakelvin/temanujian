const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');
const csv = require('csv-parser')

const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.static("data/gambar"));
app.use(bodyParser.urlencoded({extended:true}));

app.route("/")
    .get((req,res)=>res.render(__dirname+"/views/index.ejs"));

app.route("/quiz/:name")
    .get((req,res)=>{
        const results = [];
        fs.createReadStream(__dirname+"/data/csv/"+req.params.name+'.csv')
        .pipe(csv())
        .on('data', (data) =>{
            results.push(data)
        })
        .on('end', () => {
            console.log(results);
            res.render(__dirname+"/views/quiz.ejs",{quizName:req.params.name,data:JSON.stringify(results)});

            // [
            //   { NAME: 'Daffy Duck', AGE: '24' },
            //   { NAME: 'Bugs Bunny', AGE: '22' }
            // ]
        });

    })

app.route("/search")
    .get((req,res)=>{

    });

app.route("/portal")
    .get((req,res)=>{
        let titles=[]
        fs.readdir(__dirname+"/data/csv",(err,files)=>{
            files.map(function(file){
                let desc="Tes TPA"
                if (file.includes("dummy")){
                    desc="Hanya untuk Percobaan";
                }
                titles.push({
                    name:file,
                    description:desc
                });
            });
            res.render(__dirname+"/views/portal.ejs",{data:titles})
        });
    });
    

app.listen(4000,function(){
    console.log("Server Started");
});