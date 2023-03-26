const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const _ = require('lodash')
const mongoose = require('mongoose')


app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', { useNewUrlParser: true });

const itemsSchema = {
    name: String    
}

const Item = new mongoose.model('Item', itemsSchema);
 
const items = new Item({
    name: "Welcome to your todo list"
})
const items1 = new Item({
    name: "Hit the + button  to add new item"
})
const items2 = new Item({
    name: "<- hit this to delete an item"
})

const defaultArray = [items, items1, items2]

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = new mongoose.model('List',listSchema);

app.get('/', (req, res) =>{
    
    Item.find({}).then((foundItems) =>{

    
        if(foundItems.length === 0){
            Item.insertMany(defaultArray).then(()=>{
                 console.log("insert data successfully ")  // Success
                }).catch((error)=>{
                console.log(error)      // Failure
                
            });
            res.redirect('/');
        }else{
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            });
        }
       
    }) 

   
});

app.get("/:listname",(req,res)=>{

    const customeListName= _.capitalize(req.params.listname);

    
List.findOne({name: customeListName}).then((foundList)=>{
        if(!foundList){
            const list = new List ({
                name: customeListName,
                items: defaultArray
            })
            list.save();
            res.redirect('/'+ customeListName);
        }else{
            res.render("list", {
                listTitle:  foundList.name,
                newListItems: foundList.items
            });
        }
    })
    .catch((err)=>{
        console.log(err);
    });
        
    
})

app.post("/",(req,res)=>{
    const newitem = req.body.newItem;
    const listName = req.body.list;

    console.log("list name = "+listName);

    const item = new Item({
        name: newitem
    })

    if (listName === "Today") {
        item.save();
        res.redirect('/');
    }else{
        // console.log("aaaa ");
        List.findOne({name: listName}).then((foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+listName); 
        }).catch((err)=>{
            console.log(err);
        });
    }
}) 

app.post("/delete",(req,res)=>{

    const checkeditemId= req.body.check;
    const listName = req.body.listName;

    console.log(listName +" <=> "+ checkeditemId );

   if(listName === "Today"){
        Item.findByIdAndRemove(checkeditemId).then((err)=>{

            console.log("data removed")
            res.redirect("/")  // Success
           }).catch((error)=>{
           console.log(error)      // Failure
           
       });
    
    }else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkeditemId}}}).then((err)=>{
            console.log("data removed 1")
            res.redirect("/"+listName)  // Success

           }).catch((error)=>{
           console.log(error)      // Failure
           
       }); 
    }

})



app.listen(3000,(req,res)=>{
    console.log("Server listening on port 3000");
});

// app.get("/work",(req,res)=>{
    
//     res.render ("list",{
//         listTitle: "Work List", 
//         newListItems: workItems
//     })
// })
// app.post("/work",(req,res)=>{
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work")
// })
