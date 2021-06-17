var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

// App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/ Model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Restful Route
app.get("/", (_req, res) => {
  res.redirect("blog");
});

// Index Route
app.get("/blog", (_req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log("error is showing");
    }
    else {
      res.render("index", { blogs: blogs });
    }
  });
});

// New Route
app.get("/blog/new", (_req, res) => {
  res.render("new");
});

// Create Route
app.post("/blog", (req, res) => {
  console.log(req.body.blog.body);
  console.log("==================");
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log(req.body.blog.body);
  // Create Blog
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
    }
    else {
      res.redirect("/blog");
    }
  });
});

// Show route
app.get("/blog/:id", (_req, res) => {
  Blog.findById(_req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blog");
    }
    else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// Edit route
app.get("/blog/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blog")
    }
    else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

// Update route
app.put("/blog/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blog");
    }
    else {
      res.redirect("/blog/" + req.params.id);
    }
  });
});

// Delete route
app.delete("/blog/:id", (_req, res) => {
  //Destroy blog
  Blog.findByIdAndRemove(_req.params.id, (err) => {
    if (err) {
      res.redirect("/blog");
    }
    else {
      res.redirect("/blog");
    }
  })
});

app.listen(3000, () => {
  console.log("server is running");
});

// const express = require('express')
// const app = express()

// app.get('/', (req, res) => {
//   res.send('Hi!')
// })

// app.listen(3000, () => console.log('Server ready'))




// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });