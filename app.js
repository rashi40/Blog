var express = require("express");
var app= express();
var bodyParser =require("body-parser");
var mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/restful_Blog_app",{useNewUrlParser:true});
 
app.use(bodyParser.urlencoded({extended: true }));
var blogSchema =new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type:Date,default: Date.now}
});

var Blog= mongoose.model("Blog", blogSchema);
/*Blog.create({
	title:"TestBlog",
	image:"https://media4.s-nbcnews.com/j/newscms/2018_02/2285561/180109-dog-listening-mn-1215_86fd9caebf17bddbf5310597b860cef9.fit-760w.jpg",
	body:"Hello this is blog post"
},);*/

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR");
		}
		else{
		res.render("index",{blogs: blogs});	
		}
	});
	
});


app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs/new", function(req, res){
  res.render("new");	
});

app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server is Running!");
});