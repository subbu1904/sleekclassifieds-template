
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
import { Trash2, Edit, Plus, Save } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { toast } from "sonner";

export const CategoryManagement = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = localStorage.getItem("categories");
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
    
    const updatedCategories = [...categories];
    updatedCategories[index] = editValue;
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setEditingIndex(null);
    toast.success(t('admin', 'categoryUpdated'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin', 'categoryManagement')}</CardTitle>
        <CardDescription>{t('admin', 'categoryManagementDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
