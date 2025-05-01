
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import apiService from "@/services/apiService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface BoardStatusProps {
  compact?: boolean;
  className?: string;
}

const BoardStatus: React.FC<BoardStatusProps> = ({ compact = false, className }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguageContext();

  useEffect(() => {
    const checkBoardStatus = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would call the API to check if the board is connected
        // For now, let's simulate a response with mock data
        const mockResponse = await apiService.getSmartBoardStatus('user_1');
        setIsConnected(mockResponse?.connected || false);
      } catch (error) {
        console.error('Error checking board status:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBoardStatus();

    // Poll for status updates every 30 seconds
    const interval = setInterval(checkBoardStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center",
              compact ? "space-x-1" : "space-x-2",
              className
            )}
          >
            <div
              className={cn(
                "rounded-full", 
                isLoading 
                  ? "bg-gray-400 animate-pulse" 
                  : isConnected 
                    ? "bg-green-500" 
                    : "bg-red-500",
                compact ? "h-2 w-2" : "h-3 w-3"
              )}
            />
            {!compact && (
              <span 
                className={cn(
                  "text-sm", 
                  isConnected ? "text-green-500" : "text-gray-400"
                )}
              >
                {isConnected ? t("boardOnline") : t("boardOffline")}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-chess-dark text-chess-text-light border border-[rgba(255,255,255,0.15)]">
          <p>
            {isConnected ? t("boar username.dOnline") : t("boardOffline")}
          </p>
          {!isConnected && (
            <p className="text-xs text-gray-400 mt-1">
              {t("boardStatus")}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BoardStatus;
