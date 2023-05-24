const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // collections
    const patientCollection = client.db("doc-route").collection("patient");
    const doctorCollections = client.db("doc-route").collection("doctors");
    const allUsersCollection = client.db("doc-route").collection("allUsers")
   
    // add user
   app.post("/users", async (req,res)=>{
    const userData = req.body;
    const result = await allUsersCollection.insertOne(userData)
    res.send(result)
   })



    // get  userData
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = {email:email}
      const result = await allUsersCollection.findOne(query)
      res.send(result)
      
    })


    // delete user like doctor or patient
    app.delete("/users-delete/:id",async(req,res)=>{
      try{
       const id = req.params.id;
       const query = { _id: new ObjectId(id) };
       const result = await allUsersCollection.deleteOne(query)
       res.send(result)

      }catch(err){
        res.send({
          status:404,
          message:err.message
        })
      }
    })

    // getting all patients
    app.get("/pateint", async (req, res) => {
      const query = {category:"patient"}
      const options = await allUsersCollection.find(query).toArray();
      res.send(options)
    })

    //insert patient data
    app.post("/pateint", async (req, res) => {
      const pateint = req.body;
      const result = await patientCollection.insertOne(pateint)
      res.send(result)
    })
   
    //filter doctor for admin aproval
    app.get("/applying-doctor",async(req,res)=>{ 
      const doctors = await allUsersCollection.find({
        category:"doctor",
        status:"pending",
      }).toArray()      
      res.send(doctors)
     
    })
   
    // approved doctor endpoent
    app.put("/applying-doctor/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc ={
        $set:{
          status:"approved"
        }
      }
      const result = await allUsersCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })


    //get approved doctor 
    app.get("/approved-doctor",async(req,res)=>{ 
      const doctors = await allUsersCollection.find({
        category:"doctor",
        status:"approved",
      }).toArray()      
      res.send(doctors)
     
    })


    // get all doctors
    app.get("/doctors", async (req, res) => {
      const options = await await allUsersCollection.find({
        category:"doctor",
        status:"approved",
      }).toArray()
      res.send(options)
    })

    // insert a doctor
    app.post("/doctors", async (req, res) => {
    try{
      const doctor = req.body
      const result = await doctorCollections.insertOne(doctor)
      res.send(result)
    }catch(err){
      res.send({
        status:404,
        message:err.message
      })
    }
    
    });

    // update doctor status
    

    // get a doctor data by id
    app.get('/doctors/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await allUsersCollection.findOne(query);
        // console.log(result);
        res.send(result);

      } catch (err) {
        res.send({
          success: false,
          message: err.message,
        })
      }
    })

    

  } finally {

  }
}
run().catch(err => console.log(err));

app.get("/", async (req, res) => {
  res.send("doctorRoute server is running");
})

app.listen(port, () => {
  console.log(`server is running on ${port}`);
}) 