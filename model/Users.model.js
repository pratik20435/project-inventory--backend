import { model,Schema } from "mongoose";

const userSchema = new Schema({
     firstName: {
        type: String,
        required: true,

     },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        gender : {
            type: String,
            required:false,
        },
        country :{
            type: String,
            required:false,
        },
        password :{
            type:String,
            required:true,
        }
});

const Users = model("User", userSchema);

export default Users;