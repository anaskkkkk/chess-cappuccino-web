
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileAudio,
  FileMusic,
  Volume2,
  Plus,
  Search,
  Upload,
  Headphones,
  RefreshCw,
  Trash2,
  Play,
  Pause,
  Download,
  Filter,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types for the sound & asset library
interface Asset {
  id: string;
  name: string;
  type: "sound" | "music" | "image" | "video";
  url: string;
  fileSize: number;
  duration?: number;
  createdAt: string;
  tags: string[];
}

interface AssetFilter {
  search: string;
  type: "all" | "sound" | "music" | "image" | "video";
  tag?: string;
}

const SoundAndAssets: React.FC = () => {
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();
  
  // State for asset library
  const [activeTab, setActiveTab] = useState<"sounds" | "music" | "images" | "videos">("sounds");
  const [filter, setFilter] = useState<AssetFilter>({ search: "", type: "all" });
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [uploadAsset, setUploadAsset] = useState<{ name: string; type: "sound" | "music" | "image" | "video"; file: File | null; tags: string }>({
    name: "",
    type: "sound",
    file: null,
    tags: ""
  });
  
  // Query for fetching assets
  const { 
    data: assets = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ["assets", filter],
    queryFn: async () => {
      // TODO: Replace with actual API call to fetch assets
      console.log("Fetching assets with filter:", filter);
      
      // Mock data for demonstration
      return [
        { 
          id: "1", 
          name: "Chess piece move", 
          type: "sound", 
          url: "/sounds/move.mp3", 
          fileSize: 24500, 
          duration: 0.8,
          createdAt: new Date().toISOString(),
          tags: ["game", "move", "piece"]
        },
        { 
          id: "2", 
          name: "Victory fanfare", 
          type: "music", 
          url: "/sounds/victory.mp3", 
          fileSize: 1245000, 
          duration: 12.5,
          createdAt: new Date().toISOString(),
          tags: ["game", "win", "music"]
        },
        { 
          id: "3", 
          name: "Knight piece", 
          type: "image", 
          url: "/images/knight.png", 
          fileSize: 45600,
          createdAt: new Date().toISOString(),
          tags: ["piece", "knight", "image"]
        }
      ] as Asset[];
    }
  });
  
  // Mutation for uploading a new asset
  const uploadMutation = useMutation({
    mutationFn: async (newAsset: { name: string; type: string; file: File; tags: string[] }) => {
      // TODO: Replace with actual API call to upload asset
      console.log("Uploading asset:", newAsset);
      
      // Mock API response
      return { success: true, id: Math.random().toString(36).substring(7) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success(t("Asset uploaded successfully"));
      setIsUploading(false);
    },
    onError: () => {
      toast.error(t("Failed to upload asset"));
      setIsUploading(false);
    }
  });
  
  // Mutation for deleting an asset
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API call to delete asset
      console.log("Deleting asset with ID:", id);
      
      // Mock API response
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success(t("Asset deleted successfully"));
    },
    onError: () => {
      toast.error(t("Failed to delete asset"));
    }
  });
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadAsset({ ...uploadAsset, file: e.target.files[0] });
    }
  };
  
  // Handle asset upload
  const handleUpload = () => {
    if (!uploadAsset.name || !uploadAsset.file) {
      toast.error(t("Please provide a name and file"));
      return;
    }
    
    setIsUploading(true);
    
    // Split tags by comma and trim whitespace
    const tags = uploadAsset.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    
    uploadMutation.mutate({
      name: uploadAsset.name,
      type: uploadAsset.type,
      file: uploadAsset.file,
      tags
    });
  };
  
  // Play/pause audio assets
  const togglePlayback = (assetId: string, url: string) => {
    if (isPlaying === assetId) {
      setIsPlaying(null);
      // TODO: Implement stopping audio playback
    } else {
      setIsPlaying(assetId);
      // TODO: Implement playing audio
      console.log("Playing audio:", url);
      
      // Mock playback - stop after a few seconds
      setTimeout(() => {
        if (isPlaying === assetId) {
          setIsPlaying(null);
        }
      }, 3000);
    }
  };
  
  // Helper to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Filter assets based on the active tab and search/filter
  const filteredAssets = assets.filter(asset => {
    // Filter by tab
    if (activeTab === "sounds" && asset.type !== "sound") return false;
    if (activeTab === "music" && asset.type !== "music") return false;
    if (activeTab === "images" && asset.type !== "image") return false;
    if (activeTab === "videos" && asset.type !== "video") return false;
    
    // Filter by search term
    if (filter.search && !asset.name.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    // Filter by type if not "all"
    if (filter.type !== "all" && asset.type !== filter.type) {
      return false;
    }
    
    // Filter by tag if specified
    if (filter.tag && !asset.tags.includes(filter.tag)) {
      return false;
    }
    
    return true;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    }
  };
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Sound & Asset Library")}</h1>
          <p className="text-sm text-chess-text-light/70 mt-1">
            {t("Manage sound effects, music, images, and other assets for the platform")}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-chess-accent hover:bg-chess-accent/80">
              <Upload className="h-4 w-4 mr-2" />
              {t("Upload Asset")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("Upload New Asset")}</DialogTitle>
              <DialogDescription>
                {t("Add a new sound effect, music track, or image to the library")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetName" className="text-right">
                  {t("Name")}
                </Label>
                <Input
                  id="assetName"
                  value={uploadAsset.name}
                  onChange={(e) => setUploadAsset({ ...uploadAsset, name: e.target.value })}
                  placeholder={t("Asset name")}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetType" className="text-right">
                  {t("Type")}
                </Label>
                <Select
                  value={uploadAsset.type}
                  onValueChange={(value: "sound" | "music" | "image" | "video") => 
                    setUploadAsset({ ...uploadAsset, type: value })
                  }
                >
                  <SelectTrigger id="assetType" className="col-span-3">
                    <SelectValue placeholder={t("Select asset type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sound">{t("Sound Effect")}</SelectItem>
                    <SelectItem value="music">{t("Music")}</SelectItem>
                    <SelectItem value="image">{t("Image")}</SelectItem>
                    <SelectItem value="video">{t("Video")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetTags" className="text-right">
                  {t("Tags")}
                </Label>
                <Input
                  id="assetTags"
                  value={uploadAsset.tags}
                  onChange={(e) => setUploadAsset({ ...uploadAsset, tags: e.target.value })}
                  placeholder={t("Tags (comma separated)")}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetFile" className="text-right">
                  {t("File")}
                </Label>
                <Input
                  id="assetFile"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadAsset({ name: "", type: "sound", file: null, tags: "" });
                }}
              >
                {t("Cancel")}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !uploadAsset.name || !uploadAsset.file}
              >
                {isUploading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {t("Upload")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="sounds">
              <FileAudio className="h-4 w-4 mr-2" />
              {t("Sound Effects")}
            </TabsTrigger>
            <TabsTrigger value="music">
              <FileMusic className="h-4 w-4 mr-2" />
              {t("Music")}
            </TabsTrigger>
            <TabsTrigger value="images">
              <Headphones className="h-4 w-4 mr-2" />
              {t("Images")}
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Volume2 className="h-4 w-4 mr-2" />
              {t("Videos")}
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {t("Refresh")}
            </Button>
            
            <Select
              value={filter.type}
              onValueChange={(v) => setFilter({...filter, type: v as AssetFilter["type"]})}
            >
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("Type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Types")}</SelectItem>
                <SelectItem value="sound">{t("Sound")}</SelectItem>
                <SelectItem value="music">{t("Music")}</SelectItem>
                <SelectItem value="image">{t("Image")}</SelectItem>
                <SelectItem value="video">{t("Video")}</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder={t("Search assets...")}
                value={filter.search}
                onChange={(e) => setFilter({...filter, search: e.target.value})}
                className="pl-8 w-full sm:w-auto"
              />
              {filter.search && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setFilter({...filter, search: ""})}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
              </div>
            ) : filteredAssets.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-16 text-chess-text-light/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {activeTab === "sounds" ? <FileAudio className="h-16 w-16 mb-4 opacity-20" /> : 
                 activeTab === "music" ? <FileMusic className="h-16 w-16 mb-4 opacity-20" /> :
                 activeTab === "images" ? <Headphones className="h-16 w-16 mb-4 opacity-20" /> :
                 <Volume2 className="h-16 w-16 mb-4 opacity-20" />}
                <h3 className="text-xl font-medium">{t("No assets found")}</h3>
                <p className="text-sm mt-1">{t("Try changing your filters or upload new assets")}</p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    variants={itemVariants}
                    className="border rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={
                        asset.type === "sound" ? "default" : 
                        asset.type === "music" ? "secondary" : 
                        asset.type === "image" ? "outline" :
                        "destructive"
                      }>
                        {asset.type.toUpperCase()}
                      </Badge>
                      <div className="flex space-x-1">
                        {(asset.type === "sound" || asset.type === "music") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => togglePlayback(asset.id, asset.url)}
                          >
                            {isPlaying === asset.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            // TODO: Implement download logic
                            console.log("Downloading asset:", asset.url);
                            toast.success(t("Asset download started"));
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => deleteMutation.mutate(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-chess-text-light">{asset.name}</h3>
                    
                    <div className="mt-2 text-sm text-chess-text-light/60 flex flex-col gap-1">
                      <p>{formatFileSize(asset.fileSize)}</p>
                      {asset.duration && <p>{asset.duration.toFixed(1)}s</p>}
                    </div>
                    
                    <div className="mt-auto pt-3 flex flex-wrap gap-1">
                      {asset.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-chess-accent/10"
                          onClick={() => setFilter({...filter, tag})}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </motion.div>
  );
};

export default SoundAndAssets;
