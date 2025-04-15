import { employees, employeeSalaries, type Employee, type InsertEmployee, type EmployeeSalary, type InsertEmployeeSalary, type EmployeeWithCurrentSalary, type TitleSalaryStats } from "@shared/schema";
import { count, eq, and, isNull, desc, sql, like, asc } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Employee operations
  getEmployees(page: number, limit: number): Promise<{ employees: EmployeeWithCurrentSalary[], total: number }>;
  getEmployee(id: number): Promise<EmployeeWithCurrentSalary | undefined>;
  searchEmployees(name: string, title: string, page: number, limit: number): Promise<{ employees: EmployeeWithCurrentSalary[], total: number }>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  
  // Employee Salary operations
  getEmployeeSalaries(employeeId: number): Promise<EmployeeSalary[]>;
  getCurrentSalary(employeeId: number): Promise<EmployeeSalary | undefined>;
  createEmployeeSalary(salary: InsertEmployeeSalary): Promise<EmployeeSalary>;
  
  // Title operations
  getTitleStats(): Promise<TitleSalaryStats[]>;
  
  // Initialization
  initDatabase(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getEmployees(page: number = 1, limit: number = 10): Promise<{ employees: EmployeeWithCurrentSalary[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Get total count
    const totalResult = await db.select({ value: count() }).from(employees);
    const total = totalResult[0].value;
    
    // Get paginated employees
    const employeeRows = await db.select()
      .from(employees)
      .limit(limit)
      .offset(offset)
      .orderBy(asc(employees.id));
    
    // Get current salaries for these employees
    const employeesWithSalary = await Promise.all(
      employeeRows.map(async (emp: Employee) => {
        const currentSalary = await this.getCurrentSalary(emp.id);
        return {
          ...emp,
          currentSalary: currentSalary ? {
            title: currentSalary.title,
            salary: Number(currentSalary.salary)
          } : undefined
        };
      })
    );
    
    return { employees: employeesWithSalary, total };
  }

  async getEmployee(id: number): Promise<EmployeeWithCurrentSalary | undefined> {
    const [employee] = await db.select()
      .from(employees)
      .where(eq(employees.id, id));
    
    if (!employee) return undefined;
    
    const currentSalary = await this.getCurrentSalary(id);
    
    return {
      ...employee,
      currentSalary: currentSalary ? {
        title: currentSalary.title,
        salary: Number(currentSalary.salary)
      } : undefined
    };
  }

  async searchEmployees(name: string = "", title: string = "", page: number = 1, limit: number = 10): Promise<{ employees: EmployeeWithCurrentSalary[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Get all employees first
    const baseQuery = db.select().from(employees);
    const baseCountQuery = db.select({ value: count() }).from(employees);
    
    // Add name filter if provided
    if (name) {
      const nameLower = name.toLowerCase();
      const nameCondition = sql`lower(${employees.name}) LIKE ${`%${nameLower}%`}`;
      baseQuery.where(nameCondition);
      baseCountQuery.where(nameCondition);
    }
    
    // Execute queries with pagination
    const employeeRows = await baseQuery.limit(limit).offset(offset);
    const [{ value: total }] = await baseCountQuery;
    
    // Get current salaries for all employees
    const employeesWithSalary = await Promise.all(
      employeeRows.map(async (emp) => {
        const currentSalary = await this.getCurrentSalary(emp.id);
        
        // If title filter is provided and no matching salary, skip this employee
        if (title && (!currentSalary || !currentSalary.title.toLowerCase().includes(title.toLowerCase()))) {
          return null;
        }
        
        return {
          ...emp,
          currentSalary: currentSalary ? {
            title: currentSalary.title,
            salary: Number(currentSalary.salary)
          } : undefined
        };
      })
    );
    
    // Filter out null results and ensure type safety
    const filteredEmployees = employeesWithSalary.filter((emp): emp is NonNullable<typeof emp> => emp !== null);
    
    return {
      employees: filteredEmployees,
      total: title ? filteredEmployees.length : total
    };
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [result] = await db.insert(employees).values(employee).returning();
    return result;
  }

  async getEmployeeSalaries(employeeId: number): Promise<EmployeeSalary[]> {
    const salaries = await db.select()
      .from(employeeSalaries)
      .where(eq(employeeSalaries.employeeId, employeeId))
      .orderBy(desc(employeeSalaries.fromDate));
    
    return salaries.map(salary => ({
      ...salary,
      salary: Number(salary.salary)
    }));
  }

  async getCurrentSalary(employeeId: number): Promise<EmployeeSalary | undefined> {
    const [currentSalary] = await db.select()
      .from(employeeSalaries)
      .where(
        and(
          eq(employeeSalaries.employeeId, employeeId),
          isNull(employeeSalaries.toDate)
        )
      )
      .limit(1);
    
    if (!currentSalary) return undefined;
    
    return {
      ...currentSalary,
      salary: Number(currentSalary.salary)
    };
  }

  async createEmployeeSalary(salary: InsertEmployeeSalary): Promise<EmployeeSalary> {
    // First, close any current open salary record
    const currentSalary = await this.getCurrentSalary(salary.employeeId);
    if (currentSalary) {
      await db.update(employeeSalaries)
        .set({ toDate: salary.fromDate })
        .where(eq(employeeSalaries.id, currentSalary.id));
    }
    
    // Then insert the new salary record
    const [result] = await db.insert(employeeSalaries).values(salary).returning();
    
    return {
      ...result,
      salary: Number(result.salary)
    };
  }

  async getTitleStats(): Promise<TitleSalaryStats[]> {
    const result = await db.select({
      title: employeeSalaries.title,
      minSalary: sql<number>`MIN(${employeeSalaries.salary})`,
      maxSalary: sql<number>`MAX(${employeeSalaries.salary})`,
      employeeCount: sql<number>`COUNT(DISTINCT ${employeeSalaries.employeeId})`
    })
    .from(employeeSalaries)
    .groupBy(employeeSalaries.title)
    .orderBy(asc(employeeSalaries.title));
    
    return result.map(stat => ({
      ...stat,
      minSalary: Number(stat.minSalary),
      maxSalary: Number(stat.maxSalary)
    }));
  }

  async initDatabase(): Promise<void> {
    // SQLite tables are created through migrations
    console.log("Database initialization for SQLite is managed by Drizzle");
  }
}

// Use PostgreSQL database storage
export const storage = new DatabaseStorage();
