
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { translationApi } from "@/services/api/apiEndpoints";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Plus, Save, Trash, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/utils/translations";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LocalizationManagement = () => {
  const { t, language, isRTL } = useLanguageContext();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [searchTerm, setSearchTerm] = useState("");
  const [newLanguage, setNewLanguage] = useState({ code: "", name: "" });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  
  // Get all available languages
  const { data: languages = [], isLoading: isLoadingLanguages, refetch: refetchLanguages } = 
    useQuery({
      queryKey: ['languages'],
      queryFn: async () => {
        try {
          const response = await translationApi.getLanguages();
          return response.data || [];
        } catch (error) {
          console.error("Failed to fetch languages:", error);
          toast({
            title: "Error",
            description: "Failed to fetch languages. Please try again later.",
            variant: "destructive"
          });
          return [];
        }
      }
    });
  
  // Handle adding a new language
  const handleAddLanguage = async () => {
    try {
      if (!newLanguage.code || !newLanguage.name) {
        toast({
          title: "Validation Error",
          description: "Language code and name are required.",
          variant: "destructive"
        });
        return;
      }
      
      await translationApi.addLanguage(newLanguage.code, newLanguage.name);
      toast({
        title: "Success",
        description: `Added new language: ${newLanguage.name}`,
      });
      
      setNewLanguage({ code: "", name: "" });
      refetchLanguages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add language. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle translation update
  const handleUpdateTranslation = async (key: string) => {
    if (editingKey === key) {
      try {
        await translationApi.updateTranslation(selectedLanguage, key, editValue);
        toast({
          title: "Success",
          description: "Translation updated successfully.",
        });
        setEditingKey(null);
        // Update local state
        if (translations[selectedLanguage]) {
          translations[selectedLanguage][key] = editValue;
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update translation. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      setEditingKey(key);
      setEditValue(translations[selectedLanguage]?.[key] || "");
    }
  };
  
  // Filter translations based on search term
  const getFilteredTranslations = () => {
    if (!selectedLanguage || !translations[selectedLanguage]) return [];
    
    const allTranslations = Object.entries(translations[selectedLanguage] || {});
    
    if (!searchTerm) return allTranslations;
    
    return allTranslations.filter(
      ([key, value]) => 
        key.toLowerCase().includes(searchTerm.toLowerCase()) || 
        value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const filteredTranslations = getFilteredTranslations();
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Localization Management")}</h1>
          <p className="text-chess-text-light/70">
            Manage translations and language settings for your application.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => refetchLanguages()}
            className="gap-2"
          >
            <RefreshCw size={16} />
            {t("Refresh")}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="translations" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Translation Management</CardTitle>
              <CardDescription>Edit and update translations for various languages.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-1/3">
                  <Label htmlFor="language-select">Select Language</Label>
                  <div className="flex mt-1 space-x-2">
                    {isLoadingLanguages ? (
                      <div className="animate-pulse h-10 bg-gray-700/30 rounded w-full"></div>
                    ) : (
                      <select 
                        id="language-select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {Object.keys(translations).map((langCode) => (
                          <option key={langCode} value={langCode}>
                            {langCode === "en" ? "English" : 
                             langCode === "ar" ? "Arabic (العربية)" : 
                             langCode}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  <Label htmlFor="search-translations">Search Translations</Label>
                  <Input
                    id="search-translations"
                    type="text"
                    placeholder="Search by key or translation text..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="border rounded-md mt-4 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Key</TableHead>
                      <TableHead>Translation</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTranslations.length > 0 ? (
                      filteredTranslations.map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-mono text-sm">{key}</TableCell>
                          <TableCell>
                            {editingKey === key ? (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}
                                dir={isRTL ? "rtl" : "ltr"}
                              />
                            ) : (
                              <span className={isRTL ? 'text-right block' : ''} dir={isRTL ? "rtl" : "ltr"}>
                                {value}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateTranslation(key)}
                            >
                              {editingKey === key ? <Save size={16} /> : <Button variant="ghost" size="sm">Edit</Button>}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-chess-text-light/70">
                          {searchTerm ? "No translations found matching your search." : "No translations available for this language."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-chess-text-light/70">
                {filteredTranslations.length} translations
                {searchTerm && ` (filtered from ${Object.keys(translations[selectedLanguage] || {}).length})`}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language Management</CardTitle>
              <CardDescription>Add, edit or remove supported languages.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Add New Language</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language-code">Language Code (ISO 639-1)</Label>
                      <Input
                        id="language-code"
                        placeholder="e.g., fr, es, de"
                        value={newLanguage.code}
                        onChange={(e) => setNewLanguage({...newLanguage, code: e.target.value})}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="language-name">Language Name</Label>
                      <Input
                        id="language-name"
                        placeholder="e.g., French, Spanish, German"
                        value={newLanguage.name}
                        onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAddLanguage} className="gap-2">
                      <Plus size={16} />
                      Add Language
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Supported Languages</h3>
                  <div className="border rounded-md p-4 h-[200px] overflow-y-auto bg-background/50">
                    {isLoadingLanguages ? (
                      <div className="flex flex-col space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse h-8 bg-gray-700/30 rounded w-full"></div>
                        ))}
                      </div>
                    ) : languages.length > 0 ? (
                      <div className="space-y-2">
                        {Object.keys(translations).map((langCode) => (
                          <div key={langCode} className="flex items-center justify-between p-2 rounded hover:bg-white/5">
                            <div className="flex items-center space-x-2">
                              <Globe size={16} className="text-chess-text-light/70" />
                              <span>
                                {langCode === "en" ? "English" : 
                                 langCode === "ar" ? "Arabic (العربية)" : 
                                 languages.find(l => l.code === langCode)?.name || langCode}
                              </span>
                              {langCode === language && (
                                <Badge variant="secondary" className="ml-2">Active</Badge>
                              )}
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {Object.keys(translations[langCode] || {}).length} strings
                              </Badge>
                              {langCode !== "en" && (
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash size={16} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-chess-text-light/70">
                        No languages available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalizationManagement;
