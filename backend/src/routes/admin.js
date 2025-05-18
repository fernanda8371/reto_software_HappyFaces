// Admin insights routes
router.get('/insights/active-users', adminController.getActiveUsers)
router.get('/insights/problems-solved', adminController.getProblemsSolved)
router.get('/insights/task-status', adminController.getTaskStatus) 