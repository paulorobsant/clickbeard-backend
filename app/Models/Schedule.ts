import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Employee from './Employee'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => Employee, {
    foreignKey: 'employee_id',
  })
  public employee: HasOne<typeof Employee>

  @column()
  public employeeId: number

  @hasOne(() => User, {
    foreignKey: 'user_id',
  })
  public customer: HasOne<typeof User>

  @column()
  public customerId: number

  @column.dateTime()
  public startDatetime: DateTime

  @column.dateTime()
  public endDatetime: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
