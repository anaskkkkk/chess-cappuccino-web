
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Eye, Plus, PenLine, Trash, Globe, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { contentApi } from "@/services/api/apiEndpoints";

// Form validation schema
const pageFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.string(),
  language: z.string(),
  requiresAuth: z.boolean().default(false),
});

type PageFormValues = z.infer<typeof pageFormSchema>;

// Mock data for UI development
const mockPages = [
  { 
    id: "page1", 
    title: "How to Play Chess", 
    slug: "how-to-play-chess", 
    content: "# How to Play Chess\n\nChess is a two-player strategy board game...", 
    metaTitle: "Learn How to Play Chess | Smart Chess", 
    metaDescription: "Learn the basics of chess, including rules, piece movements, and basic strategies.",
    status: "published",
    language: "en",
    requiresAuth: false,
    createdAt: "2025-04-01T10:30:00Z",
    updatedAt: "2025-04-15T14:22:00Z"
  },
  { 
    id: "page2", 
    title: "About Us", 
    slug: "about-us", 
    content: "# About Smart Chess\n\nSmart Chess is a revolutionary platform...", 
    metaTitle: "About Smart Chess | Learn, Play, Compete", 
    metaDescription: "Learn about the Smart Chess platform, our mission, and our team.",
    status: "published",
    language: "en",
    requiresAuth: false,
    createdAt: "2025-03-15T08:20:00Z",
    updatedAt: "2025-04-10T11:15:00Z"
  },
  { 
    id: "page3", 
    title: "Premium Membership", 
    slug: "premium", 
    content: "# Premium Membership Benefits\n\nUnlock the full potential of Smart Chess...", 
    metaTitle: "Smart Chess Premium Membership", 
    metaDescription: "Learn about the exclusive benefits of Smart Chess Premium Membership.",
    status: "draft",
    language: "en",
    requiresAuth: true,
    createdAt: "2025-04-12T16:45:00Z",
    updatedAt: "2025-04-12T16:45:00Z"
  }
];

const ContentPages = () => {
  const { t } = useLanguageContext();
  const [pages, setPages] = useState(mockPages);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form for adding/editing pages
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
      language: "en",
      requiresAuth: false,
    }
  });

  // TODO: API - Fetch pages
  const fetchPages = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await contentApi.getPages();
      // return response;
      return mockPages;
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pages",
        variant: "destructive",
      });
      return [];
    }
  };

  // Query for fetching pages
  const { data: pagesData, isLoading } = useQuery({
    queryKey: ['content-pages'],
    queryFn: fetchPages,
    // Disabled for now to use mock data
    enabled: false,
  });

  // Edit page
  const handleEditPage = (page: any) => {
    setCurrentPage(page);
    form.reset({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      status: page.status,
      language: page.language,
      requiresAuth: page.requiresAuth,
    });
    setIsEditDialogOpen(true);
  };

  // Preview page content
  const handlePreviewPage = (content: string) => {
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  // Delete page
  const handleDeletePage = async (id: string) => {
    try {
      // TODO: API - Delete page
      // await contentApi.deletePage(id);
      
      // Update local state
      setPages(pages.filter(page => page.id !== id));
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  // Submit handler for add/edit form
  const onSubmit = async (data: PageFormValues) => {
    try {
      if (currentPage) {
        // TODO: API - Update page
        // await contentApi.updatePage(currentPage.id, data);
        
        // Update local state
        setPages(pages.map(page => 
          page.id === currentPage.id 
            ? { ...page, ...data, updatedAt: new Date().toISOString() } 
            : page
        ));
        
        setIsEditDialogOpen(false);
        toast({
          title: "Success",
          description: "Page updated successfully",
        });
      } else {
        // TODO: API - Create page
        // const newPage = await contentApi.createPage(data);
        
        // Mock a new page for UI
        const newPage = {
          id: `page${pages.length + 1}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Update local state
        setPages([...pages, newPage]);
        
        setIsAddDialogOpen(false);
        toast({
          title: "Success",
          description: "Page created successfully",
        });
      }
      
      // Reset form
      form.reset();
      setCurrentPage(null);
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      });
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/-+/g, '-');     // Replace multiple - with single -
  };

  // Filter pages based on search
  const filteredPages = pages.filter(page => {
    return page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           page.slug.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Open add dialog and reset form
  const openAddDialog = () => {
    form.reset({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
      language: "en",
      requiresAuth: false,
    });
    setCurrentPage(null);
    setIsAddDialogOpen(true);
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-chess-accent" />
          <h2 className="text-2xl font-bold">{t("Content Pages")}</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-chess-accent hover:bg-chess-accent/90">
              <Plus className="h-4 w-4 mr-2" /> {t("Add Page")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("Add New Page")}</DialogTitle>
              <DialogDescription>
                {t("Create a new content page for your website.")}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="content">{t("Content")}</TabsTrigger>
                    <TabsTrigger value="seo">{t("SEO")}</TabsTrigger>
                    <TabsTrigger value="settings">{t("Settings")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Title")}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t("Page Title")} 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Auto-generate slug if slug is empty
                                  const currentSlug = form.getValues("slug");
                                  if (!currentSlug) {
                                    form.setValue("slug", generateSlug(e.target.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Slug")}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t("page-slug")} 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(generateSlug(e.target.value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Content")} (Markdown)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("# Page Title\n\nContent goes here...")} 
                              className="font-mono min-h-[300px]" 
                              {...field} 
                            />
                          </FormControl>
                          <div className="flex justify-end mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handlePreviewPage(field.value)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> {t("Preview")}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="seo" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Meta Title")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("SEO Title")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Meta Description")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("A brief description for search engines...")} 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Status")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("Select status")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">{t("Draft")}</SelectItem>
                              <SelectItem value="published">{t("Published")}</SelectItem>
                              <SelectItem value="archived">{t("Archived")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Language")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("Select language")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">{t("English")}</SelectItem>
                              <SelectItem value="ar">{t("Arabic")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requiresAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>{t("Requires Authentication")}</FormLabel>
                            <FormDescription>
                              {t("Restrict this page to logged-in users only")}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button type="submit" className="bg-chess-accent hover:bg-chess-accent/90">
                    {t("Save")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Dialog - Same structure as Add Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("Edit Page")}</DialogTitle>
              <DialogDescription>
                {t("Update the content page.")}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Same form fields as add dialog */}
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="content">{t("Content")}</TabsTrigger>
                    <TabsTrigger value="seo">{t("SEO")}</TabsTrigger>
                    <TabsTrigger value="settings">{t("Settings")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Title")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Slug")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Content")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="font-mono min-h-[300px]" 
                              {...field} 
                            />
                          </FormControl>
                          <div className="flex justify-end mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handlePreviewPage(field.value)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> {t("Preview")}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="seo" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Meta Title")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Meta Description")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Status")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">{t("Draft")}</SelectItem>
                              <SelectItem value="published">{t("Published")}</SelectItem>
                              <SelectItem value="archived">{t("Archived")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Language")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">{t("English")}</SelectItem>
                              <SelectItem value="ar">{t("Arabic")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requiresAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>{t("Requires Authentication")}</FormLabel>
                            <FormDescription>
                              {t("Restrict this page to logged-in users only")}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button type="submit" className="bg-chess-accent hover:bg-chess-accent/90">
                    {t("Update")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("Content Preview")}</DialogTitle>
            </DialogHeader>
            <div className="border rounded-md p-6 bg-white">
              <div className="prose max-w-none">
                {/* This would be rendered Markdown in a real implementation */}
                <pre className="whitespace-pre-wrap">{previewContent}</pre>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsPreviewOpen(false)}>
                {t("Close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-chess-beige-100 rounded-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input 
              placeholder={t("Search pages...")} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableCaption>{t("A list of all content pages")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Title")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("Slug")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("Language")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("Updated")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-t-chess-accent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{t("Loading pages...")}</p>
                  </TableCell>
                </TableRow>
              ) : filteredPages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-gray-500">{t("No pages found")}</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium flex items-center">
                      {page.requiresAuth && (
                        <Info className="h-4 w-4 mr-2 text-amber-500" title="Requires Authentication" />
                      )}
                      {page.title}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-gray-600">/{page.slug}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        page.status === 'published' ? 'default' : 
                        page.status === 'draft' ? 'secondary' : 
                        'outline'
                      }>
                        {t(page.status.charAt(0).toUpperCase() + page.status.slice(1))}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {page.language === 'en' ? 'English' : 'العربية'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-500">
                      {formatDate(page.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePreviewPage(page.content)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">{t("Preview")}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPage(page)}
                        >
                          <PenLine className="h-4 w-4" />
                          <span className="sr-only">{t("Edit")}</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">{t("Delete")}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ContentPages;
