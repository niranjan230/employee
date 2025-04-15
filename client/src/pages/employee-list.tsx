import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmployeeTable } from "@/components/ui/employee-table";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { usePagination } from "@/lib/hooks/use-pagination";

// Job titles for the dropdown filter
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

interface SearchFormData {
  name: string;
  title: string;
}

export default function EmployeeList() {
  const [searchParams, setSearchParams] = useState<SearchFormData>({
    name: "",
    title: ""
  });

  const { page, setPage, limit } = usePagination();

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch 
  } = useForm<SearchFormData>({
    defaultValues: {
      name: "",
      title: ""
    }
  });

  const watchTitle = watch("title");

  // Fetch employees with search and pagination
  const { data, isLoading } = useQuery({
    queryKey: [
      "/api/employees/search", 
      searchParams.name, 
      searchParams.title, 
      page, 
      limit
    ],
    queryFn: async () => {
      let url = "/api/employees/search?";
      const params = new URLSearchParams();
      
      if (searchParams.name) params.append("name", searchParams.name);
      if (searchParams.title && searchParams.title !== "_all") params.append("title", searchParams.title);
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      
      const response = await fetch(`${url}${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch employees");
      return response.json();
    }
  });

  const totalPages = data?.total ? Math.ceil(data.total / limit) : 0;

  const onSubmit = (data: SearchFormData) => {
    setSearchParams(data);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Employee List</h2>
      
      {/* Search Form */}
      <Card className="bg-neutral-50 p-4 rounded-md mb-6">
        <h3 className="text-neutral-800 font-medium mb-3">Search Employees</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="searchName" className="mb-1">Employee Name</Label>
              <Input 
                id="searchName" 
                placeholder="Enter name"
                {...register("name")}
              />
            </div>
            <div>
              <Label htmlFor="searchTitle" className="mb-1">Job Title</Label>
              <Select
                value={watchTitle}
                onValueChange={(value) => setValue("title", value)}
              >
                <SelectTrigger id="searchTitle">
                  <SelectValue placeholder="All Titles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Titles</SelectItem>
                  {JOB_TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Table */}
      <EmployeeTable 
        employees={data?.employees || []}
        isLoading={isLoading} 
      />

      {/* Pagination */}
      {data && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={data.total}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}
