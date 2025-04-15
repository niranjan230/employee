import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Employee table
export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  ssn: text("ssn").notNull().unique(),
  dob: text("dob").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  zip: text("zip").notNull(),
  phone: text("phone").notNull(),
  joinDate: text("join_date").notNull(),
  exitDate: text("exit_date"),
});

// Employee Salary table
export const employeeSalaries = sqliteTable("employee_salaries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  fromDate: text("from_date").notNull(),
  toDate: text("to_date"),
  title: text("title").notNull(),
  salary: integer("salary").notNull(),
});

// Relations
export const employeeRelations = relations(employees, ({ many }) => ({
  salaries: many(employeeSalaries)
}));

export const employeeSalaryRelations = relations(employeeSalaries, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeSalaries.employeeId],
    references: [employees.id]
  })
}));

// Schemas for insert validation
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export const insertEmployeeSalarySchema = createInsertSchema(employeeSalaries).omit({ id: true });

// Zod schemas with additional validation
export const employeeFormSchema = insertEmployeeSchema.extend({
  dob: z.string()
    .refine(dateStr => {
      const date = new Date(dateStr);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 18 && age <= 100;
    }, "Employee must be between 18 and 100 years old"),
  ssn: z.string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format XXX-XX-XXXX"),
  phone: z.string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Phone must be in format XXX-XXX-XXXX"),
  zip: z.string()
    .length(5, "ZIP code must be 5 digits")
    .regex(/^\d{5}$/, "ZIP code must contain only numbers"),
  country: z.string()
    .refine((country) => {
      const validCountries = [
        'United States', 'Canada', 'Mexico', 'United Kingdom', 'France', 
        'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands',
        'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway',
        'Denmark', 'Finland', 'Ireland', 'Greece', 'Poland',
        'Japan', 'China', 'South Korea', 'India', 'Australia',
        'New Zealand', 'Brazil', 'Argentina', 'Chile', 'South Africa'
      ];
      return validCountries.includes(country);
    }, "Please select a valid country")
});

export const employeeSalaryFormSchema = insertEmployeeSalarySchema.extend({
  fromDate: z.string()
    .refine(dateStr => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, { message: "Invalid date format" }),
  toDate: z.string()
    .refine(dateStr => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, { message: "Invalid date format" })
    .optional()
    .nullable(),
  salary: z.number().min(20000, { message: "Salary must be at least $20,000" })
});

// Combined schema for adding a new employee with initial salary
export const newEmployeeWithSalarySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  ssn: z.string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, { message: "SSN must be in format XXX-XX-XXXX" }),
  dob: z.string()
    .refine(dateStr => {
      const date = new Date(dateStr);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 18 && age <= 100;
    }, { message: "Employee must be between 18 and 100 years old" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string()
    .refine((country) => {
      const validCountries = [
        'United States', 'Canada', 'Mexico', 'United Kingdom', 'France', 
        'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands',
        'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway',
        'Denmark', 'Finland', 'Ireland', 'Greece', 'Poland',
        'Japan', 'China', 'South Korea', 'India', 'Australia',
        'New Zealand', 'Brazil', 'Argentina', 'Chile', 'South Africa'
      ];
      return validCountries.includes(country);
    }, "Please select a valid country"),
  zip: z.string()
    .length(5, { message: "ZIP code must be 5 digits" })
    .regex(/^\d{5}$/, { message: "ZIP code must contain only numbers" }),
  phone: z.string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, { message: "Phone must be in format XXX-XXX-XXXX" }),
  joinDate: z.string()
    .refine(dateStr => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, { message: "Invalid date format" }),
  exitDate: z.string()
    .refine(dateStr => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, { message: "Invalid date format" })
    .optional()
    .nullable(),
  title: z.string().min(1, { message: "Title is required" }),
  salary: z.number().min(20000, { message: "Salary must be at least $20,000" })
});

// Types
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export type EmployeeSalary = typeof employeeSalaries.$inferSelect;
export type InsertEmployeeSalary = z.infer<typeof insertEmployeeSalarySchema>;
export type EmployeeSalaryFormData = z.infer<typeof employeeSalaryFormSchema>;

export type NewEmployeeWithSalary = z.infer<typeof newEmployeeWithSalarySchema>;

// Derived types for API responses
export type EmployeeWithCurrentSalary = Employee & {
  currentSalary?: {
    title: string;
    salary: number;
  }
};

export type TitleSalaryStats = {
  title: string;
  minSalary: number;
  maxSalary: number;
  employeeCount: number;
};
