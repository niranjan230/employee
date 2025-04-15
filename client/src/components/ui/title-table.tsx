import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TitleSalaryStats } from "@shared/schema";
import { formatCurrency } from "@/lib/utils/formatting";

interface TitleTableProps {
  titles: TitleSalaryStats[];
  isLoading: boolean;
}

export function TitleTable({ titles, isLoading }: TitleTableProps) {
  if (isLoading) {
    return <TitleTableSkeleton />;
  }

  if (titles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No job titles found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="border border-neutral-200 rounded-md">
        <TableHeader className="bg-neutral-100">
          <TableRow>
            <TableHead className="py-3 font-semibold text-neutral-700">Job Title</TableHead>
            <TableHead className="py-3 font-semibold text-neutral-700">Minimum Salary</TableHead>
            <TableHead className="py-3 font-semibold text-neutral-700">Maximum Salary</TableHead>
            <TableHead className="py-3 font-semibold text-neutral-700">Number of Employees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {titles.map((title, index) => (
            <TableRow key={index} className="border-b hover:bg-neutral-50">
              <TableCell className="py-3">{title.title}</TableCell>
              <TableCell className="py-3">{formatCurrency(title.minSalary)}</TableCell>
              <TableCell className="py-3">{formatCurrency(title.maxSalary)}</TableCell>
              <TableCell className="py-3">{title.employeeCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TitleTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <Table className="border border-neutral-200 rounded-md">
        <TableHeader className="bg-neutral-100">
          <TableRow>
            <TableHead className="py-3 font-semibold text-neutral-700">Job Title</TableHead>
            <TableHead className="py-3 font-semibold text-neutral-700">Minimum Salary</TableHead>
            <TableHead className="py-3 font-semibold text-neutral-700">Maximum Salary</TableHead>
            <TableHead className="py-3 font-semibold text-neutral-700">Number of Employees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(7)].map((_, i) => (
            <TableRow key={i} className="border-b">
              <TableCell className="py-3"><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell className="py-3"><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="py-3"><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="py-3"><Skeleton className="h-4 w-16" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
