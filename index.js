const express = require('express');
const cors = require( 'cors' );
const port = process.env.PORT || 5000; 
const { MongoClient, ServerApiVersion } = require('mongodb');

// express js server app
const app = express()

//  middleware 
app.use( cors() );
app.use(express.json())

// user name : doc-route
// pass : j2jaX7lHP6siAEDF


// mongodb cloude setup
const uri = "mongodb+srv://doc-route:j2jaX7lHP6siAEDF@cluster0.hwv6ut5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
 try{
   const patientCollectoin = client.db("doc-route").collection("patient");

   // getting all pateints
   app.get("/pateint", async(req,res)=>{
    const query = {}
    const options = await patientCollectoin.find(query).toArray()
    res.send(options)
   })

  //insert pateint data
  app.post("/pateint", async(req,res)=>{
    const pateint = req.body;
    // console.log(pateint);
    const result = await patientCollectoin.insertOne(pateint)
    res.send(result)
  })

 }finally{

 }
}
run().catch(err=>console.log(err))



app.get("/", async (req, res) => {
    res.send("doctorRoute server is runing")
})

app.listen(port, () => {
    console.log(`server is running on ${port}`);
}) 