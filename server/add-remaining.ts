
import { faker } from '@faker-js/faker';

const JOB_TITLES = [
  { title: "Software Engineer", minSalary: 80000, maxSalary: 150000 },
  { title: "Product Manager", minSalary: 90000, maxSalary: 160000 },
  { title: "Sales Representative", minSalary: 50000, maxSalary: 100000 },
  { title: "Marketing Specialist", minSalary: 55000, maxSalary: 95000 },
  { title: "HR Manager", minSalary: 65000, maxSalary: 110000 }
];

function generatePhone() {
  return `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`;
}

function generateSSN() {
  return `${faker.string.numeric(3)}-${faker.string.numeric(2)}-${faker.string.numeric(4)}`;
}

async function addRemainingEmployees() {
  for (let i = 0; i < 9; i++) {
    const jobTitle = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
    const salary = Math.floor(
      jobTitle.minSalary + Math.random() * (jobTitle.maxSalary - jobTitle.minSalary)
    );

    const employee = {
      name: faker.person.fullName(),
      ssn: generateSSN(),
      dob: faker.date.between({ from: '1970-01-01', to: '2000-12-31' }).toISOString().split('T')[0],
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip: faker.location.zipCode().substring(0, 5),
      phone: generatePhone(),
      joinDate: faker.date.between({ from: '2020-01-01', to: '2024-01-01' }).toISOString().split('T')[0],
      title: jobTitle.title,
      salary: salary
    };

    try {
      const response = await fetch('http://0.0.0.0:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      });

      const result = await response.json();
      console.log(`Added employee ${i + 1}:`, result.employee.name);
    } catch (error) {
      console.error(`Error adding employee ${i + 1}:`, error);
    }
  }
}

addRemainingEmployees().then(() => console.log('Finished adding remaining employees'));
