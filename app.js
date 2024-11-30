let express = require ("express");
let app = express();
let PORT = process.env.PORT || 3000;
let path = require('path');
let mongoose = require('mongoose')
let Post = require("./models/postModel");
let methodOverride = require("method-override");

let db = 'mongodb+srv://Vika:12345@cluster0.r4nv8.mongodb.net/Node-blog';



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false })) //щоб сервер міг зчитати дані з форм (пост запити)
app.use(methodOverride("_method"));              //підключили утиліту щоб  у коді хтмл мжна було викоритовуввати метод пут

app.get("/", (req, res)=>{                       //main page
    res.render("index", {title:'Home'});
});

app.get("/add-post", (req, res)=>{                 //page "add post"
    res.render("add-post", {title:'Add post'});
});

app.post("/add-post", (req, res)=>{
    let { title, author } = req.body;     //"витягуємо" ці поля щоб 15 рядок міг їх зчтати
    let post = new Post({ title, author });
  post
   .save()                                //зберігає у базі даних
   .then(() => res.redirect("/posts"))    // після збереження данних користувача переправляє на сторінку постс
   .catch((error) => {
 console.log(error);
 res.render("error");

});
});


app.get("/posts", (req, res)=> {          //page "posts"
    Post.find()
    .then((posts) => res.render("posts", { title:   
        "Posts", posts}))
        .catch((error) => {
            console.log(error);
            res.render("error");
        });
});


app.get("/edit-post/:id", (req, res) => {     //щоб редагувати пости (кнопка едіт на сторінці пости) - перекидає на сторінку редагування
    let id = req.params.id;
    Post.findById(id)                        //знаходить пост по ід
    .then((post) =>
    res.render("edit-post", {title: post.title, id:     //перенаправляє на сторінку редагувати пост
        post._id, post })
     )
     .catch((error) => {
        console.log(error);
        res.render("error");
    });
});


app.put("/edit-post/:id", (req,res) => {      //дозволяє вносити зміни(саме відредагувати пост)
    let id = req.params.id;                   //дістаємо конкретний ід
    const { title, author } = req.body;                
    Post.findByIdAndUpdate (id,{ title, author })        //у фігурних дужках всі поля які ми хочемо оновити
    .then(() => res.redirect(`/posts`))
    .catch((error) => {
        console.log(error);
        res.render("error");
    });
});


app.delete("/posts/:id",(req, res) => {      //забезпечення можливості видалення  даних користувачу
    let id = req.params.id;
    Post.findByIdAndDelete(id)
    .then((posts) => res.render("posts", { title:    //перенаправляє на сторінку з постами
    "Post", posts }))
    .catch((error) => {
        console.log(error);
        res.render("error");
    });
})


async function start () {   // запускає сервер правильно, запуск сервера відбудеться тільки якщо спрацює 41 рядок
try {
    await mongoose.connect(db);
    console.log(`Connection to MongoDb is success!`);
    app.listen(PORT, () =>{
        console.log(`Serwer is listening PORT $(PORT) ...
            `);
    });
}
catch (error) {
    console.log("\n Connection error!!! \n\n", error);
}
}

start();