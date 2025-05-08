
import React, { useState } from 'react';
import { useLanguageContext } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Cpu } from "lucide-react";
import { toast } from "sonner";

const SmartBoardPairingModal: React.FC = () => {
  const { t } = useLanguageContext();
  const [serialNumber, setSerialNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [pairingMethod, setPairingMethod] = useState<'qr' | 'manual'>('qr');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (pairingMethod === 'manual' && !serialNumber.trim()) {
        toast.error(t("serialNumberRequired"));
        return;
      }
      
      toast.info(t("pairingInProgress"));
      
      // Placeholder for API calls - will be implemented later
      /* TODO REST:/api/boards/pair */  
      /* TODO WS:pair_board */
      
      console.log('Pairing board with:', pairingMethod === 'qr' ? 'QR code' : serialNumber);
      
      // Simulate success for now
      setTimeout(() => {
        toast.success(t("boardPairingSuccess"));
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error('Error pairing board:', error);
      toast.error(t("boardPairingError"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-chess-text-light hover:bg-white/10 transition-colors rounded-full"
          title={t("pairSmartBoard")}
        >
          <Cpu size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-chess-beige-100 text-chess-text-dark">
        <DialogHeader>
          <DialogTitle>{t("pairSmartBoard")}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2 mt-2">
            <Button 
              variant={pairingMethod === 'qr' ? 'default' : 'outline'} 
              className={pairingMethod === 'qr' ? 'bg-chess-accent text-chess-text-light' : ''}
              onClick={() => setPairingMethod('qr')}
            >
              <QrCode className="mr-2 h-4 w-4" />
              {t("scanQRCode")}
            </Button>
            <Button 
              variant={pairingMethod === 'manual' ? 'default' : 'outline'}
              className={pairingMethod === 'manual' ? 'bg-chess-accent text-chess-text-light' : ''}
              onClick={() => setPairingMethod('manual')}
            >
              <Cpu className="mr-2 h-4 w-4" />
              {t("enterSerialNumber")}
            </Button>
          </div>
          
          {pairingMethod === 'qr' ? (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-chess-accent/50 rounded-lg">
              <QrCode size={150} className="text-chess-accent mb-4" />
              <p className="text-center text-sm text-chess-text-dark/80">
                {t("scanQRInstructions")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="serialNumber" className="text-sm font-medium">
                  {t("serialNumber")}
                </label>
                <Input
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder={t("enterSerialNumberPlaceholder")}
                  className="bg-white border-chess-accent/30"
                />
              </div>
            </form>
          )}
          
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90"
          >
            {t("pairBoard")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartBoardPairingModal;
