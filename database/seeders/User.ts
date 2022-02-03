import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'admin@clickbeard.com',
        password: 'supersecret',
        isAdmin: true,
      },
    ])
  }
}
