// use express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//create instance 
const app = express();
app.use(express.json())
app.use(cors())

//tem memory
// let todos =[];

// connect mongodb
mongoose.connect('mongodb://localhost:27017/my-app')
.then(()=> {
    console.log('Db connected')
})
.catch((err) => {
    console.log(err)
})

// create schema
const todoSchema = new mongoose.Schema({
    title : {
        required: true,
        type: String
    },
    description : String,
})

// create model
const todoModel= mongoose.model('Todo', todoSchema);

//create a new route 
app.post('/todos', async (req,res)=> {
    const {title , description} = req.body;
    // const newtodo ={
    //     id: todos.length +1 ,
    //     title ,
    //     description
    // };
    // todos.push(newtodo);
    // console.log(todos);

    try{
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });

    }
    
})

// get all item 
app.get('/todos', async (req,res) =>{
try{
    const todos = await todoModel.find();
    res.json(todos);
}catch(error){
    console.log(error)
    res.status(500).json({message});
}


})

// update item
app.put("/todos/:id", async (req,res )=> {
    try{
        const {title , description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title, description},
        {new: true}
    )

    if (!updatedTodo) {
        return res.status(404).json({message:"todo not found"})
    }
    res.json(updatedTodo)

    }catch(error){
        
    console.log(error)
    res.status(500).json({message:error.message});

    }
})

// delete item
app.delete('/todos/:id', async (req,res)=>{
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }catch(error){
        console.log(error)
        res.sendStatus(500).json({message: error.message});
    }
})

//server
const port = 8000;
app.listen(port,() => {
    console.log("Server port: " + port);
})