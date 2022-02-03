/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//  Auth

Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')
Route.get('/me', 'AuthController.getMe').middleware('auth')

// User

Route.get('/all', 'UserController.readAll')

//  Service

Route.post('/service/create', 'ServicesController.create')

Route.patch('/service/update', 'ServicesController.update')

Route.delete(
  '/service/delete/:id',
  'ServicesController.delete'
)

Route.get('/service/read/all', 'ServicesController.readAll')

Route.get(
  '/service/read/:id',
  'ServicesController.readById'
)

// Employee

Route.post('/employee/create', 'EmployeesController.create')

Route.delete(
  '/employee/delete/:id',
  'EmployeesController.delete'
)

Route.get(
  '/employee/service/:id',
  'EmployeesController.readByService'
)

Route.get(
  '/employee/read/all',
  'EmployeesController.readAll'
)

// Schedule

Route.post('/schedule/create', 'SchedulesController.create')

Route.get(
  '/schedule/read/all',
  'SchedulesController.readAll'
)

Route.get(
  '/schedule/employee',
  'SchedulesController.readByEmployee'
).middleware('auth')

Route.get(
  '/schedule/customer',
  'SchedulesController.readByCustomer'
).middleware('auth')

Route.delete(
  '/schedule/delete/:id',
  'SchedulesController.delete'
)

Route.post(
  '/schedule/employee',
  'SchedulesController.readByEmployeeAndDate'
)
