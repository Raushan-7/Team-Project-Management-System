const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('Manager'), createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, authorize('Manager'), deleteTask);

module.exports = router;
