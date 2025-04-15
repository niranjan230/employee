import { useQuery } from "@tanstack/react-query";
import { TitleTable } from "@/components/ui/title-table";

export default function TitleList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/titles"],
    queryFn: async () => {
      const response = await fetch("/api/titles");
      
      if (!response.ok) {
        throw new Error("Failed to fetch title statistics");
      }
      
      return response.json();
    }
  });

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Title List</h2>
      
      {error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error loading title data. Please try again later.</p>
        </div>
      ) : (
        <TitleTable 
          titles={data || []} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
}
