import Service from 'App/Models/Service'
import HttpStatusCode from 'App/Common/HttpStatusCode'
import HttpResponse from 'App/Common/HttpResponse'

export default class ServicesController {
  public async create({ request, response, i18n }) {
    try {
      const { name } = request.only(['name'])

      const service = await Service.query()
        .where('name', name)
        .first()

      if (service) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'service.service_already_exists'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      await Service.create({ name })

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
        .json({
          message: e,
        })
    }
  }

  public async update({ response, request, i18n }) {
    try {
      const { name, id } = request.only(['name', 'id'])

      const service = await Service.query()
        .where('id', id)
        .first()

      if (!service) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'service.selected_service_not_exist'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      await service.merge({ name }).save()

      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage(
            'common.data_successfully_saved'
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

  public async delete({ response, params, i18n }) {
    try {
      const service = await Service.findBy('id', params.id)

      if (!service) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'service.selected_service_not_exist'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      await service.delete()

      const httpResponse: HttpResponse = {
        messages: [
          i18n.formatMessage(
            'service.service_successfully_removed'
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

  public async readAll({ response }) {
    try {
      const services = await Service.all()
      return response
        .status(HttpStatusCode.OK)
        .json(services)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({
          message: e,
        })
    }
  }

  public async readById({ response, params, i18n }) {
    try {
      const service = await Service.findBy('id', params.id)

      if (!service) {
        const httpResponse: HttpResponse = {
          messages: [
            i18n.formatMessage(
              'service.selected_service_not_exist'
            ),
          ],
        }

        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json(httpResponse)
      }

      return response
        .status(HttpStatusCode.OK)
        .json(service)
    } catch (e) {
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({
          message: e,
        })
    }
  }
}
