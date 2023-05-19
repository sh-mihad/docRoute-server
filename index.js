const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// express js server app
const app = express()

//  middleware 
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// mongodb cloud setup
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hwv6ut5.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://doc-route:j2jaX7lHP6siAEDF@cluster0.hwv6ut5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const patientCollectoin = client.db("doc-route").collection("patient");
    const doctorCollections = client.db("doc-route").collection("doctors")

    // getting all pateints
    app.get("/pateint", async (req, res) => {
      const query = {}
      const options = await patientCollectoin.find(query).toArray()
      res.send(options)
    })

    //insert pateint data
    app.post("/pateint", async (req, res) => {
      const pateint = req.body;
      const result = await patientCollectoin.insertOne(pateint)
      res.send(result)
    })

    // get all doctors
    app.get("/doctors", async (req, res) => {
      const query = {}
      const options = await doctorCollections.find(query).toArray()
      res.send(options)
    })

    // get doctor
    app.get("/doctrs/:id", async(req,res)=>{
      const docId = req.params.id;
      const query = {_id:ObjectId(docId)}
      const options = await doctorCollections.findOne(query);
      res.send(options)
    })


    // insert a doctor
    app.post("/doctors", async (req, res) => {
      const doctor = req.body
      const result = await doctorCollections.insertOne(doctor)
      res.send(result)
    })

  } finally {

  }
}
run().catch(err => console.log(err))



app.get("/", async (req, res) => {
  res.send("doctorRoute server is runing")
})

app.listen(port, () => {
  console.log(`server is running on ${port}`);
}) 