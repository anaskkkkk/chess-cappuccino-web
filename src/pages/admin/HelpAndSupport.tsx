
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { 
  HelpCircle, FileText, BookOpen, MessageCircle, ExternalLink, Search,
  Mail, Phone, FileQuestion, Lightbulb, FileCheck, ChevronRight, ChevronDown
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

// Mock data for documentation articles
const mockDocuments = [
  {
    id: 1,
    title: "Getting Started with Smart Chess",
    description: "Learn the basics of the Smart Chess platform",
    category: "getting-started",
    tags: ["basics", "onboarding"],
    slug: "getting-started"
  },
  {
    id: 2,
    title: "User Management Guide",
    description: "Managing users and permissions in the admin console",
    category: "administration",
    tags: ["users", "permissions", "admin"],
    slug: "user-management"
  },
  {
    id: 3,
    title: "Creating and Managing Tournaments",
    description: "Step by step guide to create and run tournaments",
    category: "tournaments",
    tags: ["tournament", "competition", "brackets"],
    slug: "tournament-management"
  },
  {
    id: 4,
    title: "SmartBoard Device Management",
    description: "How to pair, update and troubleshoot SmartBoard devices",
    category: "hardware",
    tags: ["hardware", "smartboard", "pairing"],
    slug: "smartboard-management"
  },
  {
    id: 5,
    title: "Content Management System",
    description: "Managing courses, puzzles and articles",
    category: "content",
    tags: ["cms", "content", "courses"],
    slug: "content-management"
  },
  {
    id: 6,
    title: "System Backup and Recovery",
    description: "Best practices for system backup and recovery procedures",
    category: "administration",
    tags: ["backup", "restore", "data"],
    slug: "backup-recovery"
  },
  {
    id: 7,
    title: "Troubleshooting Common Issues",
    description: "Solutions for common platform problems",
    category: "support",
    tags: ["troubleshooting", "issues", "fixes"],
    slug: "troubleshooting"
  }
];

// Mock data for FAQs
const mockFaqs = [
  {
    id: 1,
    question: "How do I reset a user's password?",
    answer: "To reset a user's password, go to User Management, find the user, click on Actions, and select 'Reset Password'. This will send a password reset email to the user."
  },
  {
    id: 2,
    question: "How can I export system logs for analysis?",
    answer: "System logs can be exported from the Real-Time Logs page. Select the date range and log levels you're interested in, then click on the 'Export' button in the top right corner."
  },
  {
    id: 3,
    question: "What's the difference between roles and permissions?",
    answer: "Roles are collections of permissions that can be assigned to users. Permissions are individual access controls that define what actions a user can perform. Assigning roles makes it easier to manage permissions for groups of users."
  },
  {
    id: 4,
    question: "How do I connect a new SmartBoard device?",
    answer: "To connect a new SmartBoard, go to SmartBoard Fleet, click 'Add New Board', enter the device serial number, and follow the pairing procedure. Make sure the device is in pairing mode by pressing the pairing button for 5 seconds."
  },
  {
    id: 5,
    question: "Can I customize the notification templates?",
    answer: "Yes, notification templates can be customized in the Notifications page. Go to the Templates tab and select the notification type you want to modify. Changes will affect all future notifications of that type."
  }
];

// Knowledge base categories
const categories = [
  { id: "getting-started", name: "Getting Started", icon: BookOpen },
  { id: "administration", name: "Administration", icon: FileCheck },
  { id: "content", name: "Content Management", icon: FileText },
  { id: "tournaments", name: "Tournaments", icon: FileQuestion },
  { id: "hardware", name: "Hardware", icon: HelpCircle },
  { id: "support", name: "Support", icon: MessageCircle },
];

const HelpAndSupport = () => {
  const { t } = useLanguageContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Filter documents based on search and category
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = searchQuery === "" || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Filter FAQs based on search
  const filteredFaqs = mockFaqs.filter(faq => 
    searchQuery === "" || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("Help & Support")}</h2>
        <p className="text-muted-foreground">
          {t("Resources, documentation and support for administrators")}
        </p>
      </div>
      
      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("Search documentation, FAQs, and support resources...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="knowledge-base">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="knowledge-base">
            <BookOpen className="h-4 w-4 mr-2" />
            {t("Knowledge Base")}
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <FileQuestion className="h-4 w-4 mr-2" />
            {t("FAQs")}
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("Contact Support")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge-base" className="space-y-4 pt-4">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="flex gap-2"
            >
              <FileText className="h-4 w-4" />
              {t("All")}
            </Button>
            
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex gap-2"
              >
                <category.icon className="h-4 w-4" />
                {t(category.name)}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t("No documents found")}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                  {t("Try adjusting your search terms or selecting a different category")}
                </p>
              </div>
            ) : (
              filteredDocuments.map(doc => (
                <Card key={doc.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {doc.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full flex justify-between">
                      <span>{t("Read article")}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Frequently Asked Questions")}</CardTitle>
              <CardDescription>
                {t("Common questions and answers about the admin platform")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredFaqs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">{t("No FAQs found")}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("Try adjusting your search terms")}
                  </p>
                </div>
              ) : (
                filteredFaqs.map(faq => (
                  <Collapsible 
                    key={faq.id}
                    open={expandedFaq === faq.id}
                    onOpenChange={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="border rounded-lg mb-2"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50">
                        <div className="font-medium flex items-center">
                          <FileQuestion className="h-5 w-5 mr-2 text-primary" /> 
                          {faq.question}
                        </div>
                        <div>
                          {expandedFaq === faq.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Separator />
                      <div className="p-4 text-muted-foreground">
                        {faq.answer}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="flex gap-2">
                <ExternalLink className="h-4 w-4" />
                {t("View All FAQs")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t("Live Chat Support")}
                </CardTitle>
                <CardDescription>
                  {t("Chat directly with our support team")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Badge className="mr-2">ONLINE</Badge>
                    <span className="text-sm text-muted-foreground">
                      {t("Average response time")}: &lt; 5 {t("minutes")}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("Our support team is available for live assistance with your admin console questions.")}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {t("Start Chat")}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t("Email Support")}
                </CardTitle>
                <CardDescription>
                  {t("Get help via email")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("Subject")}</Label>
                  <Input
                    id="subject"
                    placeholder={t("Brief description of your issue")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">{t("Message")}</Label>
                  <Textarea
                    id="message"
                    placeholder={t("Describe your issue in detail")}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {t("Send Email")}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Additional Support Options")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <Phone className="h-8 w-8 mb-2" />
                    <h3 className="font-medium mb-1">{t("Phone Support")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Available Mon-Fri, 9am-5pm")}
                    </p>
                    <p className="font-medium mt-2">+1 (800) 555-CHESS</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <Lightbulb className="h-8 w-8 mb-2" />
                    <h3 className="font-medium mb-1">{t("Feature Requests")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Suggest new features for the platform")}
                    </p>
                    <Button variant="link" className="mt-2 p-0">
                      {t("Submit Request")}
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 mb-2" />
                    <h3 className="font-medium mb-1">{t("Documentation")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Access comprehensive guides")}
                    </p>
                    <Button variant="link" className="mt-2 p-0">
                      {t("View Docs")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

// Label component for the form fields
const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
);

// Textarea component for the form fields
const Textarea = ({ id, placeholder, rows = 3 }: { id: string, placeholder: string, rows?: number }) => (
  <textarea
    id={id}
    placeholder={placeholder}
    rows={rows}
    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

export default HelpAndSupport;
