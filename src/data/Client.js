const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const exerciseSchema = new mongoose.Schema({
    exerciseId: {
        type: Number,
    },
    date: {
        type: Date,
        required: true,
    },
    exerciseName: {
        type: String,
        required: true,
    },
    exerciseDetails: {
        type: String,
        required: true,
    },
    exercisePerformance: {
        type: String,
        required: true,
    }
})

const workoutSchema = new mongoose.Schema({
    workoutId: {
        type: Number,
    },
    date: {
        type: Date,
        required: true,
    },
    workoutName: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    exercises: [exerciseSchema]
})
const clientSchema = new mongoose.Schema({
    clientId: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    workouts: [workoutSchema], 
});

exerciseSchema.plugin(AutoIncrement, { inc_field: 'exerciseId' });
workoutSchema.plugin(AutoIncrement, { inc_field: 'workoutId' });
clientSchema.plugin(AutoIncrement, { inc_field: 'clientId' });


module.exports = mongoose.model('Client', clientSchema);;