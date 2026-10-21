import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const lists = {
  department: [
    'CSE', 'ECE', 'ME', 'EE', 'CE', 'Chemical', 'Physics', 'Mathematics',
    'BME', 'Accounts', 'Purchase', 'Registrar office', 'IT',
  ],
  budget_head: [
    'Departmental grant, CSE', 'Research grant, SERB project', 'Institute equipment fund',
    'Consumables head, CSE lab', 'Departmental grant, ECE', 'Departmental grant, ME',
    'Departmental grant, EE', 'Departmental grant, CE', 'Departmental grant, Chemical',
    'Departmental grant, Physics', 'Departmental grant, Mathematics', 'Departmental grant, BME',
  ],
  designation: [
    'Professor', 'Associate Professor', 'Assistant Professor', 'Project Scientist',
    'Research Associate', 'Technical Superintendent', 'Administrative Officer',
    'Junior Assistant', 'Senior Assistant',
  ],
  delivery_period: ['1 week', '2 weeks', '3 weeks', '4 weeks', '6 weeks', '1 month', '2 months', '3 months'],
};

try {
  const email = process.env.PIS_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.PIS_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set PIS_ADMIN_EMAIL and PIS_ADMIN_PASSWORD in backend/.env before seeding.');
  }
  if (password.length < 12) {
    throw new Error('PIS_ADMIN_PASSWORD must contain at least 12 characters.');
  }

  for (const [list, values] of Object.entries(lists)) {
    for (const value of values) {
      await prisma.listItem.upsert({
        where: { list_value: { list, value } },
        update: {},
        create: { list, value },
      });
    }
  }

  const department = await prisma.listItem.findUniqueOrThrow({
    where: { list_value: { list: 'department', value: 'IT' } },
  });
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'PIS Administrator',
      passwordHash,
      role: 'admin',
      designation: 'System Administrator',
      departmentId: department.id,
      status: 'active',
    },
    create: {
      name: 'PIS Administrator',
      email,
      passwordHash,
      role: 'admin',
      designation: 'System Administrator',
      departmentId: department.id,
      status: 'active',
    },
  });

  console.log(`Seeded dropdown lists and administrator ${admin.email}.`);
} catch (error) {
  console.error('Database seed failed:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
