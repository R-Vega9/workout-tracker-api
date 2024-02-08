const router = require('express').Router();
const controller = require("./clients.controller")
const methodNotAllowed = require('../errors/methodNotAllowed')


router.route('/:clientId/workout/new').post(controller.addWorkout).all(methodNotAllowed)
router.route('/:clientId/workout/:workoutId/exercises/:exerciseId').put(controller.editExercise).all(methodNotAllowed);
router.route('/:clientId/workout/:workoutId').get(controller.read).post(controller.addExercise).delete(controller.deleteWorkout).all(methodNotAllowed);
router.route("/").get(controller.list).post(controller.createClient).all(methodNotAllowed)

module.exports = router