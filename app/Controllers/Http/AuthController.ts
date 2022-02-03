import User from 'App/Models/User'
import Employee from 'App/Models/Employee'
import Hash from '@ioc:Adonis/Core/Hash'
import HttpStatusCode from 'App/Common/HttpStatusCode'
import HttpResponse from 'App/Common/HttpResponse'

export default class AuthController {
  public async login({ auth, request, response, i18n }) {
    const { email, password } = request.only([
      'email',
      'password',
    ])

    const user = await User.query()
      .where('email', email)
      .first()

    if (!user) {
      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage('auth.invalid_credentials'),
        ],
      }

      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json(httpResponse)
    }

    if (!(await Hash.verify(user.password, password))) {
      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage('auth.invalid_credentials'),
        ],
      }

      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json(httpResponse)
    }

    const token = await auth.use('api').generate(user)

    const httpResponse: HttpResponse = {
      data: token,
    }

    return response
      .status(HttpStatusCode.OK)
      .json(httpResponse)
  }

  public async register({ request, response, i18n }) {
    const { email, password, name } = request.only([
      'email',
      'password',
      'name',
    ])

    const existingUser = await User.query()
      .where('email', email)
      .first()

    if (existingUser) {
      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage('auth.email_already_taken'),
        ],
      }

      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json(httpResponse)
    }

    const user = await User.create({
      password,
      email,
      name,
    })

    const httpResponse: HttpResponse = {
      data: user,
      messages: [
        i18n.formatMessage(
          'auth.user_registered_successfully'
        ),
      ],
    }

    return response
      .status(HttpStatusCode.CREATED)
      .json(httpResponse)
  }

  public async getMe({ auth, response }) {
    try {
      const user = auth.user['$attributes']
      const userDetails = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }

      const employee = await Employee.query()
        .where('user_id', user.id)
        .first()

      userDetails['isEmployee'] = employee !== null

      return response
        .status(HttpStatusCode.OK)
        .json(userDetails)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({
          message: e,
        })
    }
  }
}
