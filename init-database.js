const { exec } = require('child_process')
const args = process.argv.slice(2)
const env = args.includes('--env') ? args[args.indexOf('--env') + 1] : 'development'

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}: ${stderr}`)
        reject(error)
      } else {
        console.log(`Successfully executed ${command}: ${stdout}`)
        resolve()
      }
    })
  })
}

const migrate = async (migration) => {
  try {
    await runCommand(`npx sequelize-cli db:migrate --name ${migration} --env ${env}`)
    console.log(`Successfully migrated: ${migration}`)
  } catch (error) {
    console.error(`Failed to migrate: ${migration}`, error)
    throw error
  }
}

const seed = async (seeder) => {
  try {
    await runCommand(`npx sequelize-cli db:seed --seed ${seeder} --env ${env}`)
    console.log(`Successfully seeded: ${seeder}`)
  } catch (error) {
    console.error(`Failed to seed: ${seeder}`, error)
    throw error
  }
}

const initDatabase = async () => {
  try {
    // Ejecutar la migración de limpieza primero
    await migrate('00-clean-database.js')

    // Lista de migraciones en el orden correcto
    const migrations = [
      '01-create-category.js',
      '02-permissions.js',
      '03-create-users.js',
      '04-create-roles.js',
      '05-userRoles.js',
      '06-rolePermission.js',
      '07-posts.js',
    ]

    // Ejecutar todas las migraciones
    for (const migration of migrations) {
      await migrate(migration)
    }

    // Lista de seeders en el orden correcto
    const seeders = [
      '20240716000001-seed-permissions.js',
      '20240716000002-seed-roles.js',
      '20240716000003-seed-categories.js',
      '20240716000004-seed-users.js',
      '20240716000005-seed-role-permissions-and-user-roles.js',
      '20240716000006-seed-userRole.js',
      '20240716000007-seed-posts.js',
    ]

    // Ejecutar todos los seeders
    for (const seeder of seeders) {
      await seed(seeder)
    }

    console.log('Database reset successfully.')
  } catch (error) {
    console.error('Failed to reset database:', error)
    process.exit(1)
  }
}

initDatabase()
