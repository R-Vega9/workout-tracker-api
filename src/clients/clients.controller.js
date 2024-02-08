const Client = require('../data/Client')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const { format } = require('date-fns')


async function clientExist(req, res, next) {
    try {
        const foundClient = await Client.findOne({ clientId: req.params.clientId });

        if (foundClient) {
            res.locals.client = foundClient;
            return next();
        } else {
            return next({
                status: 404,
                message: `Client does not exist with id: ${req.params.clientId}`
            });
        }
    } catch (error) {
        return next({
            status: 500,
            message: 'Error checking if client exists',
            error: error.message
        });
    }
}

async function read(req, res){
    res.json({data: res.locals.client})
}

async function list(req, res){
    const clients = await Client.find().lean()
    if(!clients?.length){
        return res.status(400).json({message: 'No Clients Found'})
    }
    res.json({clients})
}

async function createClient(req, res){
    const newClientData = req.body;
    newClientData.workouts.forEach((workout=> workout.date = format(new Date(), 'MMMM dd, yyyy')))
    try {
        const newClient = await Client.create(newClientData)
        res.status(201).json(newClient)
    } catch (error) {
        res.status(500).json({ message: 'Error creating the client.', error: error.message });
    }
}

async function addExercise(req, res){
    const {clientId, workoutId} = req.params;
    const {exerciseName, exerciseDetails, exercisePerformance } = req.body;
    try {
        const client = await Client.findOne({clientId})
        if(!client){
            return res.status(404).json({message: `Client Not Found With ID: ${clientId} `})
        }
        const workout = client.workouts.find((w) => w.workoutId === parseInt(workoutId, 10))
        if (!workout) {
            return res.status(404).json({ message: `Workout not found with id: ${workoutId}` });
        }
        const newExercise = {
            date: format(new Date(), 'MMMM dd, yyyy'),
            exerciseName,
            exerciseDetails,
            exercisePerformance,
        }
        workout.exercises.push(newExercise)
        await client.save();
        const addedExercise = workout.exercises[workout.exercises.length - 1];
        res.status(201).json(addedExercise)
    } catch (error) {
        res.status(500).json({message: 'Error adding exercise.', error: error.message})
    }
}

async function addWorkout(req, res){
    const {clientId} = req.params;
    const {workoutName, details} = req.body;
    try {
      const client = await Client.findOne({clientId});
      if (!client) {
        return res.status(404).json({ message: `Client not found with id: ${clientId}` });
      }
      const newWorkout = {
        date: format(new Date(), 'MMMM dd, yyyy'),
        workoutName,
        details,
        exercises: []
      };
      client.workouts.push(newWorkout);
      await client.save();
      const addedWorkout = client.workouts[client.workouts.length - 1];  // Get the newly added workout
      res.status(201).json(addedWorkout);  // Respond with only the newly added workout
    } catch (error){
      res.status(500).json({ message: 'Error adding workout.', error: error.message });
    }
  }
  

async function findExerciseById(client, workoutId, exerciseId) {
    const workout = client.workouts.find((w) => w.workoutId == workoutId);
    if (workout) {
        const exercise = workout.exercises.find((e) => e.exerciseId == exerciseId);
        if (exercise) {
            return { workout, exercise };
        }
    }
    return null;
}


async function editExercise(req, res){
    const { clientId, workoutId, exerciseId } = req.params;
    const { exerciseName, exerciseDetails, exercisePerformance } = req.body;

    try {
        const client = await Client.findOne({ clientId });

        if (!client) {
            return res.status(404).json({ message: `Client not found with id: ${clientId}` });
        }

        const { workout, exercise } = await findExerciseById(client, workoutId, exerciseId);

        if (!workout || !exercise) {
            return res.status(404).json({ message: 'Workout or Exercise not found' });
        }

        exercise.exerciseName = exerciseName || exercise.exerciseName;
        exercise.exerciseDetails = exerciseDetails || exercise.exerciseDetails;
        exercise.exercisePerformance = exercisePerformance || exercise.exercisePerformance;
        exercise.date = format(new Date(), 'MMMM dd, yyyy')

        await client.save();

        res.json(exercise);
    } catch (error) {
        res.status(500).json({ message: 'Error updating exercise.', error: error.message });
    }

}

async function deleteWorkout(req, res) {
    const { clientId, workoutId } = req.params;
    try {
        const client = await Client.findOne({ clientId });
        if (!client) {
            return res.status(404).json({ message: `Client not found with id: ${clientId}` });
        }
        const workoutIndex = client.workouts.findIndex((workout) => workout.workoutId == workoutId);
        if (workoutIndex === -1) {
            return res.status(404).json({ message: `Workout not found with id: ${workoutId}` });
        }
        client.workouts.splice(workoutIndex, 1);
        await client.save();
        res.json({ message: `Workout with id ${workoutId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting workout.', error: error.message });
    }
}


module.exports = {
    addWorkout: asyncErrorBoundary(addWorkout),
    addExercise: asyncErrorBoundary(addExercise),
    createClient: asyncErrorBoundary(createClient),
    editExercise: asyncErrorBoundary(editExercise),
    read: [clientExist, read],
    list: asyncErrorBoundary(list),
    deleteWorkout: asyncErrorBoundary(deleteWorkout)
}