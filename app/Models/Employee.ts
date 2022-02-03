import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Service from './Service'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @manyToMany(() => Service, {
    localKey: 'id',
    pivotForeignKey: 'employee_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'service_id',
    pivotTable: 'employees_services',
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  })
  public services: ManyToMany<typeof Service>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
