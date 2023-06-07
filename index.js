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
    const allUsersCollection = client.db("doc-route").collection("allUsers");
    const consultationCollection= client.db("doc-route").collection("consultation");
   
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
    app.delete("/users/:id",async(req,res)=>{
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

    // delete pataient
    app.delete("/pateint/:id",async(req,res)=>{
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

     // delete applying doctor
     app.delete("/approved-doctor/:id",async(req,res)=>{
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

       // delete apporved doctor
       app.delete("/doctors/:id",async(req,res)=>{
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

    // add consultation data
    app.post("/consultaion", async(req,res)=>{
      const data = req.body;
      console.log(data);
      const result = await consultationCollection.insertOne(data)
      res.send(result)
    })

    // get consulation by doctor email
    app.get("/consulation", async(req,res)=>{
     const email = req.query.email
     const query = {doctorEmail:email}
     const consulationData = await consultationCollection.find(query).toArray()
    res.send(consulationData)
    
    })

    // get all consultaion for admin
    app.get("/all-consulation",async(req,res)=>{
      const query = {}
      const allConsulation = await consultationCollection.find(query).toArray()
      res.send(allConsulation)
    })

    // update consultation 
    app.put("/consulation:id",async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc ={
        $set:{
          consultationStatus:"done"
        }
      }
      const result = await consultationCollection.updateOne(filter,updatedDoc)
      res.send(result)
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