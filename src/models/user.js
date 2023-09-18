import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        email: String,
        fistName: String,
        lastName: String,
        phone: String,
        role: String,
        password: String,
        salt: String
    },
    {
        timestamps: true
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
