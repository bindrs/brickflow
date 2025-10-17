import { useState } from "react";
import { TruckIcon, PlusIcon, EditIcon, Trash2Icon, WrenchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTractorSchema, type InsertTractor } from "@shared/schema";

export default function TractorManagement() {
  const { tractors, isLoadingTractors, createTractor, updateTractor, deleteTractor } = useApp();
  const [editingTractor, setEditingTractor] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const form = useForm<InsertTractor>({
    resolver: zodResolver(insertTractorSchema),
    defaultValues: {
      registrationNumber: "",
      model: "",
      driverName: "",
      driverPhone: "",
      status: "available"
    }
  });

  const editForm = useForm<InsertTractor>({
    resolver: zodResolver(insertTractorSchema),
  });

  const onSubmit = async (data: InsertTractor) => {
    try {
      await createTractor(data);
      form.reset();
      setShowAddDialog(false);
    } catch (error) {
      console.error('Failed to create tractor:', error);
    }
  };

  const onEdit = async (data: InsertTractor) => {
    if (!editingTractor) return;
    try {
      await updateTractor(editingTractor.id, data);
      setEditingTractor(null);
    } catch (error) {
      console.error('Failed to update tractor:', error);
    }
  };

  const handleEdit = (tractor: any) => {
    setEditingTractor(tractor);
    editForm.reset({
      registrationNumber: tractor.registrationNumber,
      model: tractor.model,
      driverName: tractor.driverName || "",
      driverPhone: tractor.driverPhone || "",
      status: tractor.status
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tractor?')) {
      try {
        await deleteTractor(id);
      } catch (error) {
        console.error('Failed to delete tractor:', error);
      }
    }
  };

  if (isLoadingTractors) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tractor Fleet Management</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-tractor">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Tractor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Tractor</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-registration-number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-model" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="driverName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} data-testid="input-driver-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="driverPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Phone</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} data-testid="input-driver-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-status">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700" data-testid="button-save-tractor">
                        Save Tractor
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tractor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tractors?.map((tractor) => (
                  <tr key={tractor.id} data-testid={`tractor-row-${tractor.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <TruckIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900" data-testid={`tractor-registration-${tractor.id}`}>
                            {tractor.registrationNumber}
                          </div>
                          <div className="text-sm text-gray-500">{tractor.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tractor.driverName ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900" data-testid={`driver-name-${tractor.id}`}>
                            {tractor.driverName}
                          </div>
                          <div className="text-sm text-gray-500">{tractor.driverPhone}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No driver assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={tractor.status === 'available' ? 'default' : 
                               tractor.status === 'assigned' ? 'secondary' : 'destructive'}
                        data-testid={`tractor-status-${tractor.id}`}
                      >
                        {tractor.status === 'maintenance' && <WrenchIcon className="h-3 w-3 mr-1" />}
                        {tractor.status.charAt(0).toUpperCase() + tractor.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(tractor)}
                        data-testid={`button-edit-tractor-${tractor.id}`}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(tractor.id)}
                        data-testid={`button-delete-tractor-${tractor.id}`}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )) || []}
              </tbody>
            </table>
            
            {(!tractors || tractors.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No tractors found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTractor} onOpenChange={() => setEditingTractor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tractor</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-registration-number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-model" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} data-testid="input-edit-driver-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="driverPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Phone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} data-testid="input-edit-driver-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-status">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingTractor(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" data-testid="button-update-tractor">
                  Update Tractor
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
