const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("1f9bc3b81ef1247ae5bac893ec4b862e645f521cc40a585bbee0156ebb9c7f15");
// const axios = require('axios');
// const apiKey = '1f9bc3b81ef1247ae5bac893ec4b862e645f521cc40a585bbee0156ebb9c7f15';
// const searchEngine = 'google_lens';
// const searchQuery = 'https://i.ibb.co/b2j1SQ1/herpes-skin.jpg';
// const apiUrl = `https://serpapi.com/search?engine=${searchEngine}&q=${searchQuery}&api_key=${apiKey}`;
const port = process.env.PORT || 5000;






const app = express()

//  middleware 
app.use(cors({
  credentials:true,
  origin:"*"
}));
app.use(express.json());
app.use(morgan('dev'));


const uri = `mongodb+srv://doc-route:j2jaX7lHP6siAEDF@cluster0.hwv6ut5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    // collections
    const allUsersCollection = client.db("doc-route").collection("allUsers");
    const consultationCollection= client.db("doc-route").collection("consultation");



    app.get("/detaction",async(req,res)=>{
      const url = req.query.url;
      // serp api code
     const params = {
        engine: "google_lens",
         url: `${url}`,
         hl: "bn"
      };

      const callback = function(data) {
      // console.log(data["visual_matches"]);
       res.send(data["visual_matches"].slice(0,10))
    };

    // Show result as JSON
    search.json(params, callback);
    })

   
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