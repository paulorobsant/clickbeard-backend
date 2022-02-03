import Employee from 'App/Models/Employee'
import User from 'App/Models/User'
import HttpStatusCode from 'App/Common/HttpStatusCode'
import HttpResponse from 'App/Common/HttpResponse'
import Database from '@ioc:Adonis/Lucid/Database'

export default class EmployeesController {
  public async create({ request, response, i18n }) {
    try {
      const { userId, servicesIds } = request.only([
        'userId',
        'servicesIds',
      ])

      const user = await User.findBy('id', userId)

      if (!user) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'user.selected_user_not_exist'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      const employee = await Employee.findBy(
        'user_id',
        userId
      )

      if (employee) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'employee.employee_already_registered'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      const newEmployee = await Employee.create({ userId })

      await newEmployee
        .related('services')
        .attach(servicesIds)

      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage(
            'common.data_successfully_saved'
          ),
        ],
      }

      return response
        .status(HttpStatusCode.CREATED)
        .json(httpResponse)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: e })
    }
  }

  public async readByService({ response, params }) {
    try {
      const { rows } = await Database.rawQuery(
        `select es.employee_id, u.name from employees_services es
        inner join employees e on e.id = es.employee_id
        inner join users u on e.user_id = u.id
        where service_id = ?`,
        [params.id]
      )

      return response.status(HttpStatusCode.OK).json(rows)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({
          message: e,
        })
    }
  }

  public async readAll({ response }) {
    try {
      const employees = await Employee.query().preload(
        'user',
        (query) => query.select(['name'])
      )

      return response
        .status(HttpStatusCode.OK)
        .json(employees)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({
          message: e,
        })
    }
  }

  public async delete({ response, params, i18n }) {
    try {
      const employee = await Employee.findBy(
        'id',
        params.id
      )

      if (!employee) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'employee.selected_employee_not_exist'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      await employee.delete()

      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage(
            'employee.employee_successfully_removed'
          ),
        ],
      }

      return response
        .status(HttpStatusCode.OK)
        .json(httpResponse)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({
          message: e,
        })
    }
  }
}
