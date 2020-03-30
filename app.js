var express = require("express");
var app= express();
var expressSanitizer= require("express-sanitizer");
var methodOverride = require("method-override");
var bodyParser =require("body-parser");
var mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/restful_Blog_app",{useNewUrlParser:true});
 
app.use(bodyParser.urlencoded({extended: true }));
app.use(expressSanitizer());
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
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else
			{
				res.render("show", {blog: foundBlog});
			}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
		req.redirect("/blogs");	
		}
		else {
				res.render("edit", {blog: foundBlog});
		}
	});
	
});

app.put("/blogs/:id", function(req, res){
		req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs");
		}
	});
});
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server is Running!");
});