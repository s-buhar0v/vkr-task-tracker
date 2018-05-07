const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const config = require('../../config')
const taskRepository = require('../repositories/tasks-repository')
const departmentRepository = require('../repositories/department-repository')
const employeeService = require('../services/employee-service')
const taskStatus = require('../resources/task-status')

const task = require('./routes/task')
const employee = require('./routes/employee')
const department = require('./routes/department')

const app = express()
const port = process.env.PORT || 4000

mongoose.connect(config.connectionString)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/task', task)
app.use('/employees', employee)
app.use('/departments', department)

app.get('/', async (request, response) => {
    const plannedTasks = await taskRepository.getTaskByStatus(taskStatus.todo)
    const inPorgressTasks = await taskRepository.getTaskByStatus(taskStatus.wip)
    const finishedTasks = await taskRepository.getTaskByStatus(taskStatus.done)

    const employees = await employeeService.getEmployeeNameList()

    response.render('index', {
        employees: employees,
        plannedTasks: plannedTasks,
        inProgressTasks: inPorgressTasks,
        finishedTasks: finishedTasks
    })
})

app.listen(port, () => {
    console.log(`Server is listening to ${port} `)
})