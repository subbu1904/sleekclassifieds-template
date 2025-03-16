
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { Trash2, Edit, Plus, Save, PlusCircle } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { toast } from "sonner";

interface LocationSubcategory {
  id: string;
  name: string;
  parent_id: string;
}

export const LocationManagement = () => {
  const { t } = useLanguage();
  const [locations, setLocations] = useState<string[]>([]);
  const [locationSubcategories, setLocationSubcategories] = useState<LocationSubcategory[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [newSublocation, setNewSublocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAddingSublocation, setIsAddingSublocation] = useState(false);
  const [editingSublocation, setEditingSublocation] = useState<string | null>(null);
  const [editSublocationValue, setEditSublocationValue] = useState("");

  useEffect(() => {
    // Load locations from localStorage
    const storedLocations = localStorage.getItem("locations");
    const storedLocationSubcategories = localStorage.getItem("locationSubcategories");
    
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    } else {
      // Default locations (Indian cities)
      const defaultLocations = [
        "Mumbai",
        "Delhi",
        "Bengaluru",
        "Chennai",
        "Kolkata",
        "Hyderabad",
        "Pune",
        "Ahmedabad",
        "Jaipur"
      ];
      setLocations(defaultLocations);
      localStorage.setItem("locations", JSON.stringify(defaultLocations));
    }
    
    if (storedLocationSubcategories) {
      setLocationSubcategories(JSON.parse(storedLocationSubcategories));
    } else {
      localStorage.setItem("locationSubcategories", JSON.stringify([]));
    }
  }, []);

  const handleAddLocation = () => {
    if (!newLocation.trim()) {
      toast.error(t('admin', 'locationCantBeEmpty'));
      return;
    }
    
    if (locations.includes(newLocation)) {
      toast.error(t('admin', 'locationAlreadyExists'));
      return;
    }
    
    const updatedLocations = [...locations, newLocation];
    setLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));
    setNewLocation("");
    toast.success(t('admin', 'locationAdded'));
  };

  const handleDeleteLocation = (index: number) => {
    const locationToDelete = locations[index];
    
    // First, check if there are any sublocations that would become orphaned
    const hasSublocations = locationSubcategories.some(sub => sub.parent_id === locationToDelete);
    
    if (hasSublocations) {
      toast.error("Cannot delete location with sublocations. Delete sublocations first.");
      return;
    }
    
    const updatedLocations = [...locations];
    updatedLocations.splice(index, 1);
    setLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));
    toast.success(t('admin', 'locationDeleted'));
  };

  const handleEditLocation = (index: number) => {
    setEditingIndex(index);
    setEditValue(locations[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (!editValue.trim()) {
      toast.error(t('admin', 'locationCantBeEmpty'));
      return;
    }
    
    if (locations.includes(editValue) && locations[index] !== editValue) {
      toast.error(t('admin', 'locationAlreadyExists'));
      return;
    }
    
    const oldLocationName = locations[index];
    const updatedLocations = [...locations];
    updatedLocations[index] = editValue;
    setLocations(updatedLocations);
    localStorage.setItem("locations", JSON.stringify(updatedLocations));
    
    // Update parent_id references in sublocations
    const updatedSublocations = locationSubcategories.map(sub => {
      if (sub.parent_id === oldLocationName) {
        return { ...sub, parent_id: editValue };
      }
      return sub;
    });
    
    setLocationSubcategories(updatedSublocations);
    localStorage.setItem("locationSubcategories", JSON.stringify(updatedSublocations));
    
    setEditingIndex(null);
    toast.success(t('admin', 'locationUpdated'));
  };
  
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
    localStorage.setItem("locationSubcategories", JSON.stringify(updatedSublocations));
    
    setNewSublocation("");
    setIsAddingSublocation(false);
    toast.success("Sublocation added successfully");
  };
  
  const handleDeleteSublocation = (id: string) => {
    const updatedSublocations = locationSubcategories.filter(sub => sub.id !== id);
    setLocationSubcategories(updatedSublocations);
    localStorage.setItem("locationSubcategories", JSON.stringify(updatedSublocations));
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
    localStorage.setItem("locationSubcategories", JSON.stringify(updatedSublocations));
    setEditingSublocation(null);
    toast.success("Sublocation updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin', 'locationManagement')}</CardTitle>
        <CardDescription>{t('admin', 'locationManagementDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Locations</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder={t('admin', 'newLocationName')}
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <Button onClick={handleAddLocation}><Plus className="h-4 w-4 mr-2" />{t('admin', 'addLocation')}</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin', 'locationName')}</TableHead>
                <TableHead className="w-[100px] text-right">{t('admin', 'actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      location
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingIndex === index ? (
                      <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(index)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditLocation(index)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteLocation(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Sublocations Section */}
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
      </CardContent>
    </Card>
  );
};
