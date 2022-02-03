import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Employee from './Employee'
import Service from './Service'

export default class EmployeesService extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => Service, {
    foreignKey: 'id',
  })
  public service: HasOne<typeof Service>

  @column()
  public serviceId: number

  @hasOne(() => Employee, {
    foreignKey: 'id',
  })
  public employee: HasOne<typeof Employee>

  @column()
  public employeeId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
