const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const date = require(__dirname+"/date.js")

let items= [];
let workItems=[]

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));


app.get('/', (req, res) =>{
    
 
   let day = date.getDate();
    res.render("list", {
        listTitle: day,
        newListItems: items
    });
});

app.post("/",(req,res)=>{
    let newitem = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(newitem);
        res.redirect("/work");
    }else{
        items.push(newitem);
        res.redirect("/");
    }
})

app.get("/work",(req,res)=>{
    
    res.render ("list",{
        listTitle: "Work List", 
        newListItems: workItems
    })
})

app.post("/work",(req,res)=>{
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work")
})


app.listen(3000,(req,res)=>{
    console.log("Server listening on port 3000");
});