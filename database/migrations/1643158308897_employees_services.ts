import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EmployeesServices extends BaseSchema {
  protected tableName = 'employees_services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('employee_id')
        .unsigned()
        .references('employees.id')
        .onDelete('CASCADE')

      table
        .integer('service_id')
        .unsigned()
        .references('services.id')
        .onDelete('CASCADE')

      table.unique(['employee_id', 'service_id'])

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
