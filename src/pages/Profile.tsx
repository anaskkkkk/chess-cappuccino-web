
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { UserCircle, Save, Trash2, Award, History, Gamepad2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import SmartBoardPairingModal from "@/components/common/SmartBoardPairingModal";

const Profile = () => {
  const { t } = useLanguageContext();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",  // Changed from user?.bio since it doesn't exist in the User type
    country: "", // Changed from user?.country since it doesn't exist in the User type
  });

  // Mock data for visualization - in a real app, this would come from an API
  const mockGameStats = {
    gamesPlayed: 42,
    winRate: 65,
    rating: 1250,
    bestWin: "Magnus Carlsen",
    puzzlesSolved: 128,
    currentStreak: 5,
  };

  // Mock data for boards
  const mockBoards = [
    { id: "B001", name: "Living Room Board", lastConnected: "2023-05-10T15:30:00Z", status: "online" },
    { id: "B002", name: "Office Board", lastConnected: "2023-05-08T09:15:00Z", status: "offline" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("profileUpdated"));
    // In a real app, this would call the API to update the profile
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call the API to delete the account
    toast.success(t("accountDeleted"));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-chess-text-light mb-6 flex items-center gap-2">
        <UserCircle className="h-8 w-8" />
        {t("profilePage")}
      </h1>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6 bg-chess-beige-100/20 w-full justify-start overflow-x-auto">
          <TabsTrigger value="personal" className="text-chess-text-light data-[state=active]:bg-chess-accent">
            {t("personalDetails")}
          </TabsTrigger>
          <TabsTrigger value="statistics" className="text-chess-text-light data-[state=active]:bg-chess-accent">
            {t("gameStatistics")}
          </TabsTrigger>
          <TabsTrigger value="boards" className="text-chess-text-light data-[state=active]:bg-chess-accent">
            {t("smartBoards")}
          </TabsTrigger>
        </TabsList>

        {/* Personal Details Tab */}
        <TabsContent value="personal">
          <Card className="bg-chess-beige-100 border-none">
            <CardHeader>
              <CardTitle>{t("personalDetails")}</CardTitle>
              <CardDescription>{t("manageYourPersonalInformation")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 border-2 border-chess-accent">
                      <AvatarFallback className="text-2xl bg-chess-accent text-chess-text-light">
                        {formData.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      {t("changeAvatar")}
                    </Button>
                  </div>
                  
                  {/* Form Fields */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("name")}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">{t("country")}</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="bg-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t("bio")}</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-chess-accent/20">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" type="button" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        {t("deleteAccount")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-chess-beige-100">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("deleteAccount")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("deleteAccountConfirmation")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 text-white">
                          {t("confirmDelete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button type="submit" className="bg-chess-accent text-white flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {t("saveChanges")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Game Statistics Tab */}
        <TabsContent value="statistics">
          <Card className="bg-chess-beige-100 border-none">
            <CardHeader>
              <CardTitle>{t("gameStatistics")}</CardTitle>
              <CardDescription>{t("yourChessPerformance")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                  <Gamepad2 className="h-10 w-10 text-chess-accent" />
                  <div>
                    <h3 className="text-sm text-gray-600">{t("gamesPlayed")}</h3>
                    <p className="text-2xl font-bold">{mockGameStats.gamesPlayed}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                  <Award className="h-10 w-10 text-chess-accent" />
                  <div>
                    <h3 className="text-sm text-gray-600">{t("winRate")}</h3>
                    <p className="text-2xl font-bold">{mockGameStats.winRate}%</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                  <BarChart3 className="h-10 w-10 text-chess-accent" />
                  <div>
                    <h3 className="text-sm text-gray-600">{t("rating")}</h3>
                    <p className="text-2xl font-bold">{mockGameStats.rating}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                  <Award className="h-10 w-10 text-chess-accent" />
                  <div>
                    <h3 className="text-sm text-gray-600">{t("puzzlesSolved")}</h3>
                    <p className="text-2xl font-bold">{mockGameStats.puzzlesSolved}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                  <History className="h-10 w-10 text-chess-accent" />
                  <div>
                    <h3 className="text-sm text-gray-600">{t("currentStreak")}</h3>
                    <p className="text-2xl font-bold">{mockGameStats.currentStreak} {t("days")}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium">{t("favoriteOpenings")}</h3>
                <div className="overflow-hidden rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="h-10 px-4 text-left font-medium">{t("opening")}</th>
                        <th className="h-10 px-4 text-left font-medium">{t("gamesPlayed")}</th>
                        <th className="h-10 px-4 text-left font-medium">{t("winRate")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{t("sicilianDefense")}</td>
                        <td className="p-4 align-middle">15</td>
                        <td className="p-4 align-middle">73%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{t("frenchDefense")}</td>
                        <td className="p-4 align-middle">8</td>
                        <td className="p-4 align-middle">62%</td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{t("ruyLopez")}</td>
                        <td className="p-4 align-middle">6</td>
                        <td className="p-4 align-middle">50%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Boards Tab */}
        <TabsContent value="boards">
          <Card className="bg-chess-beige-100 border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("smartBoards")}</CardTitle>
                <CardDescription>{t("manageYourConnectedBoards")}</CardDescription>
              </div>
              <SmartBoardPairingModal />
            </CardHeader>
            <CardContent>
              {mockBoards.length > 0 ? (
                <div className="space-y-6">
                  {mockBoards.map((board) => (
                    <div 
                      key={board.id}
                      className="p-6 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-lg font-medium">{board.name}</h3>
                        <p className="text-sm text-gray-600">
                          {t("serialNumber")}: {board.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t("lastConnected")}: {formatDate(board.lastConnected)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          board.status === 'online' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {board.status === 'online' ? t("online") : t("offline")}
                        </span>
                        <Button variant="outline" size="sm">
                          {t("rename")}
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-400 text-red-600 hover:bg-red-50">
                          {t("unpair")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-600 mb-4">{t("noSmartBoardsPaired")}</p>
                  <Button className="bg-chess-accent text-white">
                    {t("pairNewBoard")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
