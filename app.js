//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


// main().catch(err => console.log(err));

mongoose.connect('mongodb://127.0.0.1/blogDB');
console.log("conn");

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,

});

const Post = mongoose.model("Post", blogSchema);

const onePost = new Post({
    title: "I tried to set up mongoose",
    content: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum sagittis dolor, eget maximus neque pellentesque quis. Etiam finibus, tortor vel facilisis cursus, tellus metus malesuada nisl, vitae viverra justo ex non quam. Aenean aliquam metus ut tincidunt consequat. Nunc a sapien diam. Aliquam quis quam mattis purus rhoncus facilisis. Integer mattis at nunc non luctus. Sed sollicitudin massa ac commodo posuere. Pellentesque ornare nisl arcu, ac tempor orci ultrices at. Mauris ut tempus lorem, quis euismod erat. Vivamus non dui rutrum, consectetur odio at, aliquam risus. Vestibulum efficitur libero non leo fringilla fermentum."

});


// { useNewUrlParser: true }


const homeStartingContent = "Attachment apartments in delightful by motionless it no. And now she burst sir learn total. Hearing hearted shewing own ask. Solicitude uncommonly use her motionless not collecting age. The properly servants required mistaken outlived bed and. Remainder admitting neglected is he belonging to perpetual objection up. Has widen too you decay begin which asked equal any. "
const aboutContent = "Advanced extended doubtful he he blessing together. Introduced far law gay considered frequently entreaties difficulty. Eat him four are rich nor calm. By an packages rejoiced exercise. To ought on am marry rooms doubt music. Mention entered an through company as. Up arrived no painful between. It declared is prospect an insisted pleasure. "
const contactContent = "On am we offices expense thought. Its hence ten smile age means. Seven chief sight far point any. Of so high into easy. Dashwoods eagerness oh extensive as discourse sportsman frankness. Husbands see disposed surprise likewise humoured yet pleasure. Fifteen no inquiry cordial so resolve garrets as. Impression was estimating surrounded solicitude indulgence son shy. "

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(3000, function () {
    console.log("Server started for blog on 3000")
});

app.get("/", async function (req, res) {
    var posts = await Post.find({}, {});
    if (posts.length === 0) {
        Post.insertMany([onePost], {})
        res.redirect("/");
    }
    else
        res.render('home', { content: homeStartingContent, posts: posts });
})

app.get("/contact", function (req, res) {
    res.render('contact', { content: contactContent });
})

app.get("/about", function (req, res) {
    res.render("about", { content: aboutContent });
})

app.get("/compose", function (req, res) {
    res.render("compose");
})


app.get("/posts/:postId", async function (req, res) {
    const requestedId = req.params.postId;
    console.log(requestedId);
    const post = await Post.findById(requestedId);
    console.log(post.title);
    if (post.length != 0)
        res.render("post", { title: post.title, content: post.content });

})


app.post("/compose", async function (req, res) {
    console.log(req.body);
    const blogPost = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    try {
        await blogPost.save();
    }
    catch (e) {
        console.log(e);
        // put that error callback here
    }

    res.redirect("/");
})

