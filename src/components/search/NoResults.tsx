
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NoResults = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold mb-4">No results found</h2>
      <p className="text-gray-500 mb-6">
        Try adjusting your search filters
      </p>
      <Button onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
};
