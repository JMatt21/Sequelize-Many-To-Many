// Requiring necessary npm packages
var express = require("express");
var bodyParser = require("body-parser");
// var session = require("express-session");
// Requiring passport as we've configured it
// var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
// app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// Requiring our routes
// require("./routes/html-routes.js")(app);
// require("./routes/api-routes.js")(app);
// require("./routes/auth-routes.js")(app);
// app.get('/', function (req, res) {
//   db.Products.findAll({
//     include: [{
//       model: db.product_category,
//       include: [db.Categories]
//     }]
//   }
//   ).then(function (ret) {
//     // console.log(ret[0].product_categories);
//     ret[0].product_categories.forEach((thing) => {
//       console.log(thing);
//     })
//   });
// });

// Seeds for our test database
const seed = () => {
  app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
  return sync().then(() => {
    return Promise.all([
      db.Products.create({ name: 'Tennis Racket' }),
      db.Products.create({ name: 'Baseball Bat' }),
      db.Categories.create({ name: 'Sports' }),
      db.Categories.create({ name: 'Excercise' }),
    ])
      .then(result => {
        return Promise.all([
          db.product_category.create({ ProductId: result[0].id, CategoryId: result[2].id }),
          db.product_category.create({ ProductId: result[1].id, CategoryId: result[3].id }),
          db.product_category.create({ ProductId: result[1].id, CategoryId: result[2].id })
        ]);
      });
  })
}
// Syncing our database and logging a message to the user upon success
const sync = () => {
  return db.sequelize.sync({ force: true });
}

seed()
  .then(() => console.log('synced'))
  .then(() => {
    db.Product.findAll({
      include: [{
        model: db.product_category,
        include: [{
          model: db.Categories,
          where: { name: 'Tennis Racket' }
        }]
      }]
    }).then(function (dbProduct) {
      // console.log(dbProduct);
      dbProduct.forEach(product => {
        console.log(product.name)
        product.product_categories.forEach(productCategory =>
          console.log(productCategory.Category.name));
      })
    });
  })
  .catch(e => console.log(e));