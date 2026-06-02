import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app= express();
const PORT=3000;
app.use(express.json());
app.use(cors());
await mongoose.connect("mongodb://localhost:27017/emp");
const empSchema=new mongoose.Schema({
    empId: Number,
    empName: String,
    des: String,
    dept: String,
    join: String
})
const Emp=mongoose.model("Emp",empSchema);
app.post('/emp', async(req,res)=> {
    const { empId, empName, des, dept, join}= req.body;
    try{
        const emp=new Emp({empId, empName, des, dept, join});
        await emp.save();
        res.status(201).json({message: "Employee added successfully"});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});
app.get('/emp/:id', async(req, res)=>{
    try{
        const emp=await Emp.findOne({empId: req.params.id});
        if(!emp){
            res.status(404).json({message: "Employee not Found"});
        }
        res.json(emp);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});
app.put('/emp/:id', async(req, res)=>{
    try{
        const emp= await Emp.findOneAndUpdate(
            {empId: Number(req.params.id)}, 
            {$set: { des: req.body.des}},
            {new: true}
        );
        if(!emp){
            res.status(404).json({message: "Employee not updated"});
        }
        res.json(emp);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});
app.delete('/emp/:id', async(req, res)=>{
    try{
    const emp= await Emp.deleteOne({empId: req.params.id});
    if(emp.deletedCount==0){
        res.status(404).json({message: "Employee not found"});
    }
    res.json({message: "Employee deleted"});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})
app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
