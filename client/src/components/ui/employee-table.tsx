import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EmployeeWithCurrentSalary } from "@shared/schema";
import { formatCurrency, formatDate } from "@/lib/utils/formatting";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeTableProps {
  employees: EmployeeWithCurrentSalary[];
  isLoading?: boolean;
}

function EmployeeTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  );
}

export function EmployeeTable({ employees, isLoading }: EmployeeTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithCurrentSalary | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  if (isLoading) {
    return <EmployeeTableSkeleton />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="border border-neutral-200 rounded-md">
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead className="py-3 font-semibold text-neutral-700">Name</TableHead>
              <TableHead className="py-3 font-semibold text-neutral-700">Title</TableHead>
              <TableHead className="py-3 font-semibold text-neutral-700">Current Salary</TableHead>
              <TableHead className="py-3 font-semibold text-neutral-700">Join Date</TableHead>
              <TableHead className="py-3 font-semibold text-neutral-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="border-b hover:bg-neutral-50">
                <TableCell className="py-3">{employee.name}</TableCell>
                <TableCell className="py-3">{employee.currentSalary?.title || "N/A"}</TableCell>
                <TableCell className="py-3">
                  {employee.currentSalary
                    ? formatCurrency(employee.currentSalary.salary)
                    : "N/A"}
                </TableCell>
                <TableCell className="py-3">{formatDate(employee.joinDate)}</TableCell>
                <TableCell className="py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary h-8 w-8 mr-1"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <p>Name: {selectedEmployee.name}</p>
                <p>Phone: {selectedEmployee.phone}</p>
                <p>Date of Birth: {formatDate(selectedEmployee.dob)}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-sm text-gray-500">
                  {selectedEmployee.address}<br />
                  {selectedEmployee.city}, {selectedEmployee.country} {selectedEmployee.zip}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Employment</h4>
                <p>Join Date: {formatDate(selectedEmployee.joinDate)}</p>
                <p>Current Title: {selectedEmployee.currentSalary?.title || "N/A"}</p>
                <p>
                  Current Salary:{" "}
                  {selectedEmployee.currentSalary
                    ? formatCurrency(selectedEmployee.currentSalary.salary)
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
