import { UserCollection } from "../models/user_model.js";
import { AuthCollection } from "../models/auth_model.js";


// ================= ADD USER =================
export const addUser = async (req,res)=>{

  try{

    const {email,name,phone,address,education,age,exp,image} = req.body;

    if(!email || !name){
      return res.status(400).json({
        success:false,
        message:"Email and name required"
      });
    }

    const existing = await UserCollection.findOne({email});

    if(existing){
      return res.status(400).json({
        success:false,
        message:"User already exists"
      });
    }

    const newUser = await UserCollection.create({
      email,
      name,
      phone,
      address,
      education,
      age,
      exp,
      image
    });

    res.json({
      success:true,
      data:newUser
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


// ================= UPDATE USER =================
export const updateUser = async (req,res)=>{

  const {email,...data} = req.body;

  const user = await UserCollection.findOneAndUpdate(
    {email},
    data,
    {new:true}
  );

  res.json({
    success:true,
    data:user
  });

};


// ================= GET ALL USERS =================
export const getAllUser = async (req,res)=>{

  const users = await UserCollection.find();

  res.json({
    success:true,
    data:users
  });

};


// ================= GET USER =================
export const getUserById = async (req,res)=>{

  const {email} = req.params;

  const user = await UserCollection.findOne({email});

  if(!user){
    return res.status(404).json({
      success:false,
      message:"User not found"
    });
  }

  res.json({
    success:true,
    data:user
  });

};


// ================= DELETE USER =================
export const deleteUser = async (req,res)=>{

  const {email} = req.params;

  await UserCollection.deleteOne({email});

  await AuthCollection.deleteOne({email});

  res.json({
    success:true,
    message:"User deleted"
  });

};


// ================= UPDATE ROLE =================
export const updateUserRole = async (req,res)=>{

  const {email,role} = req.body;

  if(!["admin","delivery"].includes(role)){
    return res.status(400).json({
      success:false,
      message:"Invalid role"
    });
  }

  const user = await AuthCollection.findOne({email});

  if(!user){
    return res.status(404).json({
      success:false,
      message:"User not found"
    });
  }

  if(user.role === "admin"){
    return res.status(403).json({
      success:false,
      message:"Admin role cannot change"
    });
  }

  user.role = role;

  await user.save();

  res.json({
    success:true,
    message:"Role updated"
  });

};