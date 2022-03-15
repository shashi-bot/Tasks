const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
mongoose.connect("mongodb+srv://Admin-shashi:lol-123@cluster0.oi4eg.mongodb.net/todolistDB",{useNewUrlParser:true});
const itemsSchema ={
  name: String
};
const Item = mongoose.model("Item",itemsSchema);
const item1 = new Item({
  name : "start now"
});
const defaultItems =[item1];

app.get("/",function(req,res){
  var today = new Date();
  var day = today.toLocaleString('en-us',{weekday:'long'});;
  Item.find({},function(err,foundItems){
    if(foundItems.length==0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully saved");
        }
      });
      res.redirect("/");
    }
    else{res.render("list",{newDay:day,newListItems:foundItems});}

  });


});
app.post("/delete",function(req,res){
  const checkedId = req.body.checkbox;
  Item.findByIdAndRemove(checkedId,function(err){
    if(!err){
      console.log("successfully deleted");
      res.redirect("/");
    }
  });

});
app.post("/",function(req,res){
var itemName =  req.body.newItem;
const item = new Item({
  name : itemName
});
item.save();

res.redirect("/");
});
app.get("/about",function(req,res){
  res.render("about");
})
app.listen(process.env.PORT || 3000,function(){
  console.log("server started");
});
