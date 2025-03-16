
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Save, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { LocationSubcategory } from "./types";
import { saveSublocationsToStorage } from "./locationUtils";

interface SublocationsListProps {
  locations: string[];
  locationSubcategories: LocationSubcategory[];
  setLocationSubcategories: React.Dispatch<React.SetStateAction<LocationSubcategory[]>>;
}

export const SublocationsList = ({ 
  locations, 
  locationSubcategories, 
  setLocationSubcategories 
}: SublocationsListProps) => {
  const [newSublocation, setNewSublocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isAddingSublocation, setIsAddingSublocation] = useState(false);
  const [editingSublocation, setEditingSublocation] = useState<string | null>(null);
  const [editSublocationValue, setEditSublocationValue] = useState("");

  const handleAddSublocation = () => {
    if (!newSublocation.trim()) {
      toast.error("Sublocation name cannot be empty");
      return;
    }
    
    if (!selectedLocation) {
      toast.error("Please select a parent location");
      return;
    }
    
    // Check if sublocation already exists for this parent
    const sublocationExists = locationSubcategories.some(
      sub => sub.name.toLowerCase() === newSublocation.toLowerCase() && 
             sub.parent_id === selectedLocation
    );
    
    if (sublocationExists) {
      toast.error("Sublocation already exists for this location");
      return;
    }
    
    const newSublocationItem: LocationSubcategory = {
      id: Date.now().toString(), // Simple ID generation
      name: newSublocation,
      parent_id: selectedLocation
    };
    
    const updatedSublocations = [...locationSubcategories, newSublocationItem];
    setLocationSubcategories(updatedSublocations);
    saveSublocationsToStorage(updatedSublocations);
    
    setNewSublocation("");
    setIsAddingSublocation(false);
    toast.success("Sublocation added successfully");
  };
  
  const handleDeleteSublocation = (id: string) => {
    const updatedSublocations = locationSubcategories.filter(sub => sub.id !== id);
    setLocationSubcategories(updatedSublocations);
    saveSublocationsToStorage(updatedSublocations);
    toast.success("Sublocation deleted successfully");
  };
  
  const handleEditSublocation = (id: string) => {
    const sublocation = locationSubcategories.find(sub => sub.id === id);
    if (sublocation) {
      setEditingSublocation(id);
      setEditSublocationValue(sublocation.name);
    }
  };
  
  const handleSaveSublocationEdit = (id: string) => {
    if (!editSublocationValue.trim()) {
      toast.error("Sublocation name cannot be empty");
      return;
    }
    
    const sublocation = locationSubcategories.find(sub => sub.id === id);
    if (!sublocation) return;
    
    // Check if name would duplicate
    const isDuplicate = locationSubcategories.some(
      sub => sub.name.toLowerCase() === editSublocationValue.toLowerCase() && 
             sub.parent_id === sublocation.parent_id &&
             sub.id !== id
    );
    
    if (isDuplicate) {
      toast.error("Sublocation name already exists for this location");
      return;
    }
    
    const updatedSublocations = locationSubcategories.map(sub => {
      if (sub.id === id) {
        return { ...sub, name: editSublocationValue };
      }
      return sub;
    });
    
    setLocationSubcategories(updatedSublocations);
    saveSublocationsToStorage(updatedSublocations);
    setEditingSublocation(null);
    toast.success("Sublocation updated successfully");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Sublocations</h3>
        <Button 
          size="sm" 
          onClick={() => setIsAddingSublocation(!isAddingSublocation)}
          variant="outline"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Sublocation
        </Button>
      </div>
      
      {isAddingSublocation && (
        <div className="bg-muted/20 p-4 rounded-md mb-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Parent Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sublocation Name</label>
              <div className="flex gap-2">
                <Input
                  placeholder="New sublocation name"
                  value={newSublocation}
                  onChange={(e) => setNewSublocation(e.target.value)}
                />
                <Button onClick={handleAddSublocation}>Add</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sublocation</TableHead>
            <TableHead>Parent Location</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locationSubcategories.length > 0 ? (
            locationSubcategories.map((sublocation) => (
              <TableRow key={sublocation.id}>
                <TableCell>
                  {editingSublocation === sublocation.id ? (
                    <Input
                      value={editSublocationValue}
                      onChange={(e) => setEditSublocationValue(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    sublocation.name
                  )}
                </TableCell>
                <TableCell>{sublocation.parent_id}</TableCell>
                <TableCell className="text-right">
                  {editingSublocation === sublocation.id ? (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleSaveSublocationEdit(sublocation.id)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditSublocation(sublocation.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteSublocation(sublocation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                No sublocations found. Add a sublocation to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
