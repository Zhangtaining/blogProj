var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
//app configuration

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "http://cdn.akc.org/content/article-body-image/siberian_husky_cute_puppies.jpg",
//   body: "HELLO THIS IS A BLOG POST"
   
// });
//Restful Routes

app.get("/",function(req,res) {
   res.redirect("/blogs"); 
});


//index route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", {blogs : blogs});
        }
    });
});
//new route
app.get("/blogs/new",function(req,res) {
   res.render("new.ejs");
});


//create route
app.post("/blogs", function(req, res) {
   //creat blog redirect
   req.body.blog.body = req.sanitize(req.body.blog.body);
   
   Blog.create(req.body.blog, function(err, newBlog){
      if (err) {
          res.render("new");
      } else {
          res.redirect("/blogs");
      }
   });
});

//show

app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, findBlog) {
      if (err) {
          res.redirect("/blogs");
      } else {
          res.render("show", {blog : findBlog});
      }
   });
});

//Edit route

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, findBlog) {
       if (err) {
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog: findBlog});
       }
    });
});


//update route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
      if (err) {
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//delete 

app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
   //redirect 
});

    
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is working"); 
});