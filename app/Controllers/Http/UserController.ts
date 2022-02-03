import User from 'App/Models/User'
import HttpStatusCode from 'App/Common/HttpStatusCode'

export default class UserController {
  public async readAll({ response }) {
    try {
      const users = await User.all()

      return response.status(HttpStatusCode.OK).json(users)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({
          message: e,
        })
    }
  }
}
