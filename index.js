const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dspyj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("WellCome to BridgenetComputer Database");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const ServiceCollection = client
    .db("bridgenetComputer")
    .collection("services");
  const BookingsCollection = client
    .db("bridgenetComputer")
    .collection("bookings");
  const ReviewsCollection = client
    .db("bridgenetComputer")
    .collection("reviews");

  app.get("/services", (req, res) => {
    ServiceCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/reviews", (req, res) => {
    ReviewsCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/allBookings", (req, res) => {
    BookingsCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/services/:id", (req, res) => {
    ServiceCollection.find({ _id: ObjectID(req.params.id) }).toArray(
      (err, documents) => {
        res.send(documents[0]);
      }
    );
  });

  app.post("/addService", (req, res) => {
    const newService = req.body;
    ServiceCollection.insertOne(newService).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    ReviewsCollection.insertOne(newReview).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    BookingsCollection.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/bookings", (req, res) => {
    BookingsCollection.find({ email: req.query.email }).toArray(
      (err, documents) => {
        res.send(documents);
      }
    );
  });

  app.delete("/delete/:id", (req, res) => {
    ServiceCollection.deleteOne({ _id: ObjectID(req.params.id) }).then(
      (result) => {
        res.send(result.deletedCount > 0);
      }
    );
  });

  app.patch("/updateBooking/:id", (req, res) => {
    BookingsCollection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: { status: req.body.status },
      }
    ).then((result) => {
      res.send(result.modifiedCount > 0);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
