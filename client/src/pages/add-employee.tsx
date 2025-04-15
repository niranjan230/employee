import { EmployeeForm } from "@/components/ui/employee-form";

export default function AddEmployee() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
      <EmployeeForm />
    </div>
  );
}
