import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create mock user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      emailVerified: new Date(),
    },
  })

  // Create mock remediation metrics
  await prisma.remediationMetrics.createMany({
    data: [
      {
        timestamp: new Date('2023-12-01'),
        successRate: 95,
        totalRemediations: 100,
        averageTime: 120,
      },
      {
        timestamp: new Date('2023-12-15'),
        successRate: 97,
        totalRemediations: 150,
        averageTime: 110,
      },
      {
        timestamp: new Date('2023-12-30'),
        successRate: 98,
        totalRemediations: 200,
        averageTime: 100,
      },
    ],
  })

  // Create mock remediations
  await prisma.remediation.createMany({
    data: [
      {
        id: '1',
        status: 'completed',
        details: { type: 'patch', severity: 'high' },
        lastUpdate: new Date('2023-12-30'),
      },
      {
        id: '2',
        status: 'active',
        details: { type: 'configuration', severity: 'medium' },
        lastUpdate: new Date('2023-12-30'),
      },
      {
        id: '3',
        status: 'failed',
        details: { type: 'firewall', severity: 'critical' },
        lastUpdate: new Date('2023-12-29'),
      },
    ],
  })

  // Create mock auto remediation status
  await prisma.autoRemediationStatus.create({
    data: {
      isRunning: true,
      timestamp: new Date(),
    },
  })

  // Create mock auto remediation config
  await prisma.autoRemediationConfig.create({
    data: {
      safeImpactThreshold: 0.5,
      maxAffectedSystems: 10,
      riskThreshold: 0.7,
      systemicThreshold: 0.8,
      monitoringInterval: 300,
      timestamp: new Date(),
    },
  })

  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
