// Requiring necessary npm packages
var express = require("express");
var bodyParser = require("body-parser");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Seeds for our test database
const seed = () => {
  app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
  return sync().then(() => {
    return Promise.all([
      db.Users.create({ name: "jessie", beginnerSkills: ['javascript', 'python'] }),
      db.Users.create({ name: "rick" }),
      db.Users.create({ name: "james" }),
      db.Users.create({ name: "matt" }),
      db.Users.create({ name: "mr lonely" })
    ])
      .then(result => {
        return Promise.all([
          db.Matches.create({ UserId: result[0].id, MatchId: result[1].id }),
          db.Matches.create({ UserId: result[1].id, MatchId: result[0].id }),

          db.Matches.create({ UserId: result[1].id, MatchId: result[2].id }),
          db.Matches.create({ UserId: result[2].id, MatchId: result[1].id }),

          db.Matches.create({ UserId: result[0].id, MatchId: result[3].id }),
          db.Matches.create({ UserId: result[3].id, MatchId: result[0].id }),

          db.Messages.create({ message: 'suck a fart out of my ass', UserId: result[0].id, RecipientId: result[1].id }),
          db.Messages.create({ message: 'no fuck u', UserId: result[1].id, RecipientId: result[0].id }),
          db.Messages.create({ message: 'wooooooooooooooooooooow', UserId: result[0].id, RecipientId: result[1].id }),

          db.Messages.create({ message: 'dude fucking jessie is weird af', UserId: result[1].id, RecipientId: result[2].id }),
          db.Messages.create({ message: 'Wow thats pretty strange if i do say so myself', UserId: result[2].id, RecipientId: result[1].id }),

          db.Messages.create({ message: 'hi', UserId: result[0].id, RecipientId: result[3].id }),
          db.Messages.create({ message: 'hi', UserId: result[3].id, RecipientId: result[0].id }),

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

    // db.Users.findAll({
    //   include: [
    //     {
    //       model: db.Messages,
    //       include: [{
    //         model: db.Users,
    //         as: "Recipient"
    //       }],
    //     },
    //     {
    //       model: db.Matches,
    //       include: [{
    //         model: db.Users,
    //         include: [{
    //           model: db.Messages,
    //         }],
    //         as: "Match"
    //       }]
    //     }]
    // }).then(function (dbUsers) {
    //   console.log("----------ARRAY----------");
    //   // to loop thru array
    //   dbUsers.forEach(dbUser => {
    //     const { name, password, email, beginnerSkills, intermediateSkills, advancedSkills } = dbUser;
    //     console.log(`\nname: ${name}`);
    //     console.log(`password: ${password}`);
    //     console.log(`email: ${email}`);
    //     console.log(`beginnerSkills: ${beginnerSkills}`);
    //     console.log(`intermediateSkills: ${intermediateSkills}`);
    //     console.log(`advancedSkills: ${advancedSkills}`);

    //     console.log("-------SENT MESSAGES--------");
    //     // try { // Try/Catch statement not needed as dbUser.Messages will be an empty array
    //     dbUser.Messages.forEach(dbMessage => {
    //       console.log(`${dbMessage.message} to ${dbMessage.Recipient.name}`);
    //     });
    //     // } catch (e) {
    //     // console.log(`User ${name}, has no messages.`);
    //     // }

    //     console.log("-------RECEIVED MESSAGES--------");

    //     // try { // Same and will also work nicely if the user has no matches because it will also be an empty array
    //     dbUser.Matches.forEach(dbMatch => {
    //       dbMatch.Match.Messages.forEach(dbMessage => {
    //         console.log(`${dbMessage.message} from ${dbMatch.Match.name}`);
    //       })
    //     })
    //     // } catch (e) {
    //     // console.log(`User ${name}, has been sent no messages.`);
    //     // }
    //   });
    // })

    let id = 2;
    db.Users.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: db.Messages,
          include: [{
            model: db.Users,
            as: "Recipient"
          }],
        },
        {
          model: db.Matches,
          include: [{
            model: db.Users,
            include: [{
              model: db.Messages,
              where: {
                RecipientId: id
              },
              // this required key means that if a match has sent them no messages,
              // they will still show up as a match
              required: false
            }],
            as: "Match"
          }]
        }]
    }).then(function (dbUser) {
      console.log("----------SPECIFIC-----------");
      // for 1st thing
      const { name, password, email, beginnerSkills, intermediateSkills, advancedSkills } = dbUser;
      console.log(`name: ${name}`);
      console.log(`password: ${password}`);
      console.log(`email: ${email}`);
      console.log(`beginnerSkills: ${beginnerSkills}`);
      console.log(`intermediateSkills: ${intermediateSkills}`);
      console.log(`advancedSkills: ${advancedSkills}`);

      console.log("--------MATCHES-----------");
      dbUser.Matches.forEach(dbMatch => {
        console.log(dbMatch.Match.name);
      })

      console.log("-------SENT MESSAGES--------");
      try {
        dbUser.Messages.forEach(dbMessage => {
          console.log(`${dbMessage.message} to ${dbMessage.Recipient.name}`);
        });
      } catch (e) {
        console.log(`User ${name}, has no messages.`);
      }

      console.log("-------RECEIVED MESSAGES--------");
      // console.log(dbUser.Matches[0].Match.Messages);

      dbUser.Matches.forEach(dbMatch => {
        if (dbMatch.Match.Messages.length > 0) {
          dbMatch.Match.Messages.forEach(dbMessage => {
            console.log(`${dbMessage.message} from ${dbMatch.Match.name}`);
          })
        } else {
          console.log(`no messages from ${dbMatch.Match.name}`);
        }
      });
    })
  })
  .catch(e => console.log(e));