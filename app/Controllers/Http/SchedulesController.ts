import Schedule from 'App/Models/Schedule'
import Employee from 'App/Models/Employee'
import User from 'App/Models/User'
import moment from 'moment-timezone'
import HttpStatusCode from 'App/Common/HttpStatusCode'
import HttpResponse from 'App/Common/HttpResponse'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SchedulesController {
  public async create({ request, response, i18n }) {
    try {
      const { employeeId, customerId, startDatetime } =
        request.only([
          'employeeId',
          'startDatetime',
          'customerId',
        ])

      const costumer = await User.findBy('id', customerId)

      if (!costumer) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'customer.selected_customer_not_exist'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      const employee = await Employee.findBy(
        'id',
        employeeId
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

      const endDatetime = moment
        .tz(startDatetime, 'America/Sao_Paulo')
        .add(30, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss z') as any

      await Schedule.create({
        startDatetime: moment
          .tz(startDatetime, 'America/Sao_Paulo')
          .format('YYYY-MM-DD HH:mm:ss z') as any,
        endDatetime,
        employeeId,
        customerId,
      })

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
      console.log(e)
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: e })
    }
  }

  public async readAll({ response }) {
    try {
      const { rows } = await Database.rawQuery(
        `select u2."name" as employee, 
          u."name" as customer, 
          s.start_datetime, 
          s.end_datetime, s.id from schedules s 
        inner join users u on u.id = s.customer_id 
        inner join employees e on e.id = s.employee_id 
        inner join users u2 on u2.id = e.user_id`
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

  public async readByCustomer({ response, auth }) {
    try {
      const { user } = auth
      const { rows } = await Database.rawQuery(
        `select u2."name" as employee, 
          u."name" as customer, 
          s.start_datetime, 
          s.end_datetime, s.id from schedules s 
        inner join users u on u.id = s.customer_id 
        inner join employees e on e.id = s.employee_id 
        inner join users u2 on u2.id = e.user_id
        where s.customer_id = ? `,
        [user.id]
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

  public async readByEmployee({ response, auth }) {
    try {
      const { user } = auth
      const { rows } = await Database.rawQuery(
        `select u2."name" as employee, 
          u."name" as customer, 
          s.start_datetime, 
          s.end_datetime, s.id from schedules s 
        inner join users u on u.id = s.customer_id 
        inner join employees e on e.id = s.employee_id 
        inner join users u2 on u2.id = e.user_id
        where e.user_id = ? `,
        [user.id]
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

  public async readByEmployeeAndDate({
    response,
    request,
  }) {
    try {
      const { date, employeeId } = request.only([
        'date',
        'employeeId',
      ])
      const busySchedules = await Database.rawQuery(
        `select * from schedules s 
        where Date(start_datetime) = :date
        and s.employee_id = :id`,
        {
          id: employeeId,
          date: date,
        }
      )

      const intervalPerCustomer = 30
      const commercialHours = 10

      const schedules: string[] = []

      Array.from({
        length: commercialHours * 2,
      })
        .fill(1, commercialHours * 2)
        .forEach((_, n: number) => {
          const currentDate = moment()
            .tz('America/Sao_Paulo')
            .set({
              hour: 8,
              minute: 0,
              second: 0,
            })
            .add(intervalPerCustomer * n, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss')

          const isNotAvailable = busySchedules.rows?.some(
            (item) => {
              const date = moment(item.start_datetime)
                .tz('America/Sao_Paulo')
                .format('YYYY-MM-DD HH:mm:ss')

              return date === currentDate
            }
          )

          if (isNotAvailable) return

          schedules.push(currentDate)
        })

      return response
        .status(HttpStatusCode.OK)
        .json(schedules)
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
      const schedule = await Schedule.findBy(
        'id',
        params.id
      )

      if (!schedule) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'schedule.selected_schedule_not_exist'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      await schedule.delete()

      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage(
            'schedule.schedule_successfully_removed'
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
