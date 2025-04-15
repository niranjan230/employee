import { faker } from '@faker-js/faker';
import { db } from './db';
import { employees, employeeSalaries } from '@shared/schema';
import { formatInputForPhone } from '@/lib/utils/formatting';

// Function to generate a unique SSN
function generateUniqueSSN(): string {
  const num1 = Math.floor(Math.random() * 900 + 100).toString();
  const num2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const num3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${num1}-${num2}-${num3}`;
}

const JOB_TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Product Manager",
  "HR Specialist",
  "Marketing Coordinator",
  "Data Analyst",
  "Customer Service Representative",
  "Sales Representative",
  "Operations Manager",
  "Financial Analyst"
];

export async function initializeDatabase() {
  console.log('Database initialization for SQLite is managed by Drizzle');

  // Check if database is empty
  const employeeCount = await db.select().from(employees).execute();
  
  if (employeeCount.length > 0) {
    console.log('Database already contains data. Skipping initialization.');
    return;
  }

  console.log('Database is empty. Initializing with sample data...');
  console.log('Generating 100 employees...');

  // Generate 100 employees with random data
  for (let i = 0; i < 100; i++) {
    try {
      // Create employee record
      const employee = await db.insert(employees).values({
        name: faker.person.fullName(),
        ssn: generateUniqueSSN(),
        dob: faker.date.between({ 
          from: new Date(1960, 0, 1), 
          to: new Date(2000, 11, 31) 
        }).toISOString().split('T')[0],
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.helpers.arrayElement([
          'United States', 'Canada', 'Mexico', 'United Kingdom', 'France',
          'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands',
          'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway',
          'Denmark', 'Finland', 'Ireland', 'Greece', 'Poland',
          'Japan', 'China', 'South Korea', 'India', 'Australia',
          'New Zealand', 'Brazil', 'Argentina', 'Chile', 'South Africa'
        ]),
        zip: faker.location.zipCode('#####'),
        phone: formatInputForPhone(faker.string.numeric(10)),
        joinDate: faker.date.between({ 
          from: new Date(2015, 0, 1), 
          to: new Date() 
        }).toISOString().split('T')[0],
        exitDate: Math.random() > 0.9 ? faker.date.recent().toISOString().split('T')[0] : null
      }).returning().get();

      // Create initial salary record
      await db.insert(employeeSalaries).values({
        employeeId: employee.id,
        fromDate: employee.joinDate,
        toDate: null,
        title: faker.helpers.arrayElement(JOB_TITLES),
        salary: faker.number.int({ min: 40000, max: 150000 })
      }).execute();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  }

  console.log('Employee data generation complete.');
  console.log('Database initialization complete.');
}
