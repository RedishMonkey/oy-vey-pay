// const users = [{id:1, name:'Itay'},{id:2, name:'Yarin'},{id:3, name:'Dori'},{id:4, name:'Ofir'}]

// const User = require('../models/users')



// const getUsers = (req, res) => {  
//     return res.json(users);
//   }

// const addUser = async (req, res) => {
//     const {name,username} = req.body;

//     const user = new User({name,username});

//     await user.save();

//     return res.status(201).json({messege: 'User created'});
//   }

// const updateUser = (req, res) => {
//     const {id} = req.params 
//     const {name} = req.body;
    
//     if(!id)
//     {
//         res.status(400).send('id doesnt exist');
//     }
//     if(!name)
//     {
//         res.status(400).send('name doesnt exist');
//     }

//     userIndex = users.findIndex(user => user.id == id);
//     if(userIndex==-1)
//     {
//         res.send('user doesnt exist')
//     }
//     users[userIndex].name = name
//     res.send('user updated')
// }

// const deleteUser = (req,res) => {
//     const {id} = req.params

//     if(!id)
//     {
//         res.status(400).send('did not get id')
//     }
//     userIndex = users.findIndex(user => user.id == id);
//     if(id == -1)
//     {
//         res.status(400).send('user doesnt exist');
//     }

//     users.splice(userIndex,1);
//     res.send('user deleted');
// }

// module.exports = {
//     getUsers,
//     addUser,
//     updateUser,
//     deleteUser
// }