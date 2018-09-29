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
      db.Products.create({ name: 'Tennis Racket' }), //0
      db.Products.create({ name: 'Baseball Bat' }),
      db.Categories.create({ name: 'Sports' }),
      db.Categories.create({ name: 'Excercise' }), //3
      db.Products.create({ name: 'Balls'}),
      db.Products.create({ name: 'Base Ball'}),
      db.Products.create({ name: 'Basket Ball'}), //6
      db.Products.create({ name: 'Foot Ball'})
    ])
      .then(result => {
        return Promise.all([
          db.product_category.create({ ProductId: result[0].id, CategoryId: result[2].id }),
          db.product_category.create({ ProductId: result[1].id, CategoryId: result[3].id }),
          db.product_category.create({ ProductId: result[1].id, CategoryId: result[2].id }),
          db.subproduct.create({ ProductId: result[4].id, SubproductId: result[5].id}),
          db.subproduct.create({ ProductId: result[4].id, SubproductId: result[6].id}),
          db.subproduct.create({ ProductId: result[4].id, SubproductId: result[7].id}),
          db.subproduct.create({ ProductId: result[5].id, SubproductId: result[6].id}),
          db.subproduct.create({ ProductId: result[5].id, SubproductId: result[7].id}),
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
    db.Products.findOne({
      where: {id: 4},
      include: [{
        model: db.subproduct,
        include: [{
          model: db.Products,
          as: 'Subproduct'
        }]
      }]
    }).then(function (dbProduct) {
      console.log(`This: ${dbProduct.name}`)
      // console.log(dbProduct.subproducts);
      dbProduct.subproducts.forEach(sub => {
        console.log(`Sub: ${sub.Subproduct.name}`);
        // console.log(sub.Subproduct.name)
      })
    });
  })
  .catch(e => console.log(e));