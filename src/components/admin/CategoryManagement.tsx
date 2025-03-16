
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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

interface Subcategory {
  id: string;
  name: string;
  parent_id: string;
}

export const CategoryManagement = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [editSubcategoryValue, setEditSubcategoryValue] = useState("");

  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = localStorage.getItem("categories");
    const storedSubcategories = localStorage.getItem("subcategories");
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Default categories
      const defaultCategories = [
        t('categories', 'vehicles'),
        t('categories', 'realEstate'),
        t('categories', 'electronics'),
        t('categories', 'fashion'),
        t('categories', 'art'),
        t('categories', 'books'),
        t('categories', 'music'),
        t('categories', 'photography'),
      ];
      setCategories(defaultCategories);
      localStorage.setItem("categories", JSON.stringify(defaultCategories));
    }
    
    if (storedSubcategories) {
      setSubcategories(JSON.parse(storedSubcategories));
    } else {
      localStorage.setItem("subcategories", JSON.stringify([]));
    }
  }, [t]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error(t('admin', 'categoryCantBeEmpty'));
      return;
    }
    
    if (categories.includes(newCategory)) {
      toast.error(t('admin', 'categoryAlreadyExists'));
      return;
    }
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setNewCategory("");
    toast.success(t('admin', 'categoryAdded'));
  };

  const handleDeleteCategory = (index: number) => {
    const categoryToDelete = categories[index];
    
    // First, check if there are any subcategories that would become orphaned
    const hasSubcategories = subcategories.some(sub => sub.parent_id === categoryToDelete);
    
    if (hasSubcategories) {
      toast.error("Cannot delete category with subcategories. Delete subcategories first.");
      return;
    }
    
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    toast.success(t('admin', 'categoryDeleted'));
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setEditValue(categories[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (!editValue.trim()) {
      toast.error(t('admin', 'categoryCantBeEmpty'));
      return;
    }
    
    if (categories.includes(editValue) && categories[index] !== editValue) {
      toast.error(t('admin', 'categoryAlreadyExists'));
      return;
    }
    
    const oldCategoryName = categories[index];
    const updatedCategories = [...categories];
    updatedCategories[index] = editValue;
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    
    // Update parent_id references in subcategories
    const updatedSubcategories = subcategories.map(sub => {
      if (sub.parent_id === oldCategoryName) {
        return { ...sub, parent_id: editValue };
      }
      return sub;
    });
    
    setSubcategories(updatedSubcategories);
    localStorage.setItem("subcategories", JSON.stringify(updatedSubcategories));
    
    setEditingIndex(null);
    toast.success(t('admin', 'categoryUpdated'));
  };
  
  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) {
      toast.error("Subcategory name cannot be empty");
      return;
    }
    
    if (!selectedCategory) {
      toast.error("Please select a parent category");
      return;
    }
    
    // Check if subcategory already exists for this parent
    const subcategoryExists = subcategories.some(
      sub => sub.name.toLowerCase() === newSubcategory.toLowerCase() && 
             sub.parent_id === selectedCategory
    );
    
    if (subcategoryExists) {
      toast.error("Subcategory already exists for this category");
      return;
    }
    
    const newSubcategoryItem: Subcategory = {
      id: Date.now().toString(), // Simple ID generation
      name: newSubcategory,
      parent_id: selectedCategory
    };
    
    const updatedSubcategories = [...subcategories, newSubcategoryItem];
    setSubcategories(updatedSubcategories);
    localStorage.setItem("subcategories", JSON.stringify(updatedSubcategories));
    
    setNewSubcategory("");
    setIsAddingSubcategory(false);
    toast.success("Subcategory added successfully");
  };
  
  const handleDeleteSubcategory = (id: string) => {
    const updatedSubcategories = subcategories.filter(sub => sub.id !== id);
    setSubcategories(updatedSubcategories);
    localStorage.setItem("subcategories", JSON.stringify(updatedSubcategories));
    toast.success("Subcategory deleted successfully");
  };
  
  const handleEditSubcategory = (id: string) => {
    const subcategory = subcategories.find(sub => sub.id === id);
    if (subcategory) {
      setEditingSubcategory(id);
      setEditSubcategoryValue(subcategory.name);
    }
  };
  
  const handleSaveSubcategoryEdit = (id: string) => {
    if (!editSubcategoryValue.trim()) {
      toast.error("Subcategory name cannot be empty");
      return;
    }
    
    const subcategory = subcategories.find(sub => sub.id === id);
    if (!subcategory) return;
    
    // Check if name would duplicate
    const isDuplicate = subcategories.some(
      sub => sub.name.toLowerCase() === editSubcategoryValue.toLowerCase() && 
             sub.parent_id === subcategory.parent_id &&
             sub.id !== id
    );
    
    if (isDuplicate) {
      toast.error("Subcategory name already exists for this category");
      return;
    }
    
    const updatedSubcategories = subcategories.map(sub => {
      if (sub.id === id) {
        return { ...sub, name: editSubcategoryValue };
      }
      return sub;
    });
    
    setSubcategories(updatedSubcategories);
    localStorage.setItem("subcategories", JSON.stringify(updatedSubcategories));
    setEditingSubcategory(null);
    toast.success("Subcategory updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin', 'categoryManagement')}</CardTitle>
        <CardDescription>{t('admin', 'categoryManagementDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Categories</h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder={t('admin', 'newCategoryName')}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory}><Plus className="h-4 w-4 mr-2" />{t('admin', 'addCategory')}</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin', 'categoryName')}</TableHead>
                <TableHead className="w-[100px] text-right">{t('admin', 'actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      category
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingIndex === index ? (
                      <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(index)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditCategory(index)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteCategory(index)}>
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
        
        {/* Subcategories Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Subcategories</h3>
            <Button 
              size="sm" 
              onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}
              variant="outline"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
          </div>
          
          {isAddingSubcategory && (
            <div className="bg-muted/20 p-4 rounded-md mb-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Parent Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Subcategory Name</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="New subcategory name"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                    />
                    <Button onClick={handleAddSubcategory}>Add</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subcategory</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell>
                      {editingSubcategory === subcategory.id ? (
                        <Input
                          value={editSubcategoryValue}
                          onChange={(e) => setEditSubcategoryValue(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        subcategory.name
                      )}
                    </TableCell>
                    <TableCell>{subcategory.parent_id}</TableCell>
                    <TableCell className="text-right">
                      {editingSubcategory === subcategory.id ? (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleSaveSubcategoryEdit(subcategory.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditSubcategory(subcategory.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteSubcategory(subcategory.id)}
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
                    No subcategories found. Add a subcategory to get started.
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
