import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  employeeFormSchema, 
  employeeSalaryFormSchema, 
  newEmployeeWithSalarySchema
} from "@shared/schema";
import { initializeDatabase } from "./dbInit";
import { initDb } from "./db";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database schema first
  const dbInitialized = await initDb();
  if (!dbInitialized) {
    throw new Error("Failed to initialize database schema");
  }

  // Initialize database with sample data if needed
  await initializeDatabase();

  // API routes - all prefixed with /api
  
  // Get paginated employees
  app.get("/api/employees", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string || "1");
      const limit = parseInt(req.query.limit as string || "10");
      
      const result = await storage.getEmployees(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  // Search employees
  app.get("/api/employees/search", async (req: Request, res: Response) => {
    try {
      const name = req.query.name as string || "";
      const title = req.query.title as string || "";
      const page = parseInt(req.query.page as string || "1");
      const limit = parseInt(req.query.limit as string || "10");
      
      const result = await storage.searchEmployees(name, title, page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error searching employees:", error);
      res.status(500).json({ message: "Failed to search employees" });
    }
  });

  // Get single employee by ID
  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployee(id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  // Create new employee with initial salary
  app.post("/api/employees", async (req: Request, res: Response) => {
    try {
      const validatedData = newEmployeeWithSalarySchema.parse(req.body);
      
      // Use string dates directly
      const dobString = validatedData.dob;
      const joinDateString = validatedData.joinDate;
      const exitDateString = validatedData.exitDate || null;
      
      // Create the employee record
      const employee = await storage.createEmployee({
        name: validatedData.name,
        ssn: validatedData.ssn,
        dob: dobString,
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country,
        zip: validatedData.zip,
        phone: validatedData.phone,
        joinDate: joinDateString,
        exitDate: exitDateString
      });
      
      // Create the initial salary record
      const salary = await storage.createEmployeeSalary({
        employeeId: employee.id,
        fromDate: joinDateString,
        toDate: null,
        title: validatedData.title,
        salary: validatedData.salary // Keep as number
      });
      
      res.status(201).json({ employee, salary });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Failed to create employee" });
      }
    }
  });

  // Get employee salary history
  app.get("/api/employees/:id/salaries", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const salaries = await storage.getEmployeeSalaries(id);
      res.json(salaries);
    } catch (error) {
      console.error("Error fetching salary history:", error);
      res.status(500).json({ message: "Failed to fetch salary history" });
    }
  });

  // Add new salary record for employee
  app.post("/api/employees/:id/salaries", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployee(id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      const validatedData = employeeSalaryFormSchema.parse(req.body);
      
      // Use string dates directly
      const fromDateString = validatedData.fromDate;
      const toDateString = validatedData.toDate || null;
      
      const salary = await storage.createEmployeeSalary({
        employeeId: id,
        fromDate: fromDateString,
        toDate: toDateString,
        title: validatedData.title,
        salary: validatedData.salary // Remove toString() to keep it as a number
      });
      
      res.status(201).json(salary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error adding salary record:", error);
      res.status(500).json({ message: "Failed to add salary record" });
    }
  });

  // Get title statistics
  app.get("/api/titles", async (req: Request, res: Response) => {
    try {
      const titleStats = await storage.getTitleStats();
      res.json(titleStats);
    } catch (error) {
      console.error("Error fetching title statistics:", error);
      res.status(500).json({ message: "Failed to fetch title statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
