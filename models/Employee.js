import mongoose from 'mongoose'
const Schema = mongoose.Schema


const employeeSchema = new Schema(
{
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    document: {
        type: String,
        required: true
    },
    id: String
})

export default mongoose.model('Employee', employeeSchema);