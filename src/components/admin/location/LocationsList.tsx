
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
import { Trash2, Edit, Plus, Save } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { toast } from "sonner";
import { LocationSubcategory } from "./types";
import { hasSublocations, saveLocationsToStorage, updateParentReferences, saveSublocationsToStorage } from "./locationUtils";

interface LocationsListProps {
  locations: string[];
  setLocations: React.Dispatch<React.SetStateAction<string[]>>;
  locationSubcategories: LocationSubcategory[];
  setLocationSubcategories: React.Dispatch<React.SetStateAction<LocationSubcategory[]>>;
}

export const LocationsList = ({ 
  locations, 
  setLocations, 
  locationSubcategories,
  setLocationSubcategories
}: LocationsListProps) => {
  const { t } = useLanguage();
  const [newLocation, setNewLocation] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

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
    saveLocationsToStorage(updatedLocations);
    setNewLocation("");
    toast.success(t('admin', 'locationAdded'));
  };

  const handleDeleteLocation = (index: number) => {
    const locationToDelete = locations[index];
    
    // First, check if there are any sublocations that would become orphaned
    if (hasSublocations(locationToDelete, locationSubcategories)) {
      toast.error("Cannot delete location with sublocations. Delete sublocations first.");
      return;
    }
    
    const updatedLocations = [...locations];
    updatedLocations.splice(index, 1);
    setLocations(updatedLocations);
    saveLocationsToStorage(updatedLocations);
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
    saveLocationsToStorage(updatedLocations);
    
    // Update parent_id references in sublocations
    const updatedSublocations = updateParentReferences(
      oldLocationName, 
      editValue, 
      locationSubcategories
    );
    
    setLocationSubcategories(updatedSublocations);
    saveSublocationsToStorage(updatedSublocations);
    
    setEditingIndex(null);
    toast.success(t('admin', 'locationUpdated'));
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Locations</h3>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder={t('admin', 'newLocationName')}
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
        <Button onClick={handleAddLocation}>
          <Plus className="h-4 w-4 mr-2" />
          {t('admin', 'addLocation')}
        </Button>
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
  );
};
