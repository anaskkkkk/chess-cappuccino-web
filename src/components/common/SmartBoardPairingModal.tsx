
import React, { useState, useEffect, useRef } from 'react';
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
import { Cpu, Camera, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQrScanner } from "@/hooks/useQrScanner";

const SmartBoardPairingModal: React.FC = () => {
  const { t } = useLanguageContext();
  const [serialNumber, setSerialNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [pairingMethod, setPairingMethod] = useState<'camera' | 'manual'>('camera');
  const qrContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    scannedCode,
    error,
    isScanning,
    cameraPermissionDenied,
    start,
    stop
  } = useQrScanner({
    onSuccess: (decodedText) => {
      setSerialNumber(decodedText);
      toast.info(t("qrCodeDetected"));
    },
    onError: (errorMessage) => {
      console.error("QR Scanner error:", errorMessage);
      toast.error(t("cameraAccessFailed"));
      setPairingMethod('manual');
    },
    timeoutSeconds: 30
  });

  // Start/stop camera based on modal state and pairing method
  useEffect(() => {
    if (isOpen && pairingMethod === 'camera' && !isScanning) {
      // Short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        start('qr-reader');
      }, 300);
      return () => clearTimeout(timer);
    }
    
    if (!isOpen && isScanning) {
      stop();
    }
  }, [isOpen, pairingMethod, isScanning, start, stop]);

  // Show manual entry if camera permission is denied
  useEffect(() => {
    if (cameraPermissionDenied && pairingMethod === 'camera') {
      setPairingMethod('manual');
    }
  }, [cameraPermissionDenied, pairingMethod]);

  // Update serial number when QR code is detected
  useEffect(() => {
    if (scannedCode) {
      setSerialNumber(scannedCode);
    }
  }, [scannedCode]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      if (pairingMethod === 'manual' && !serialNumber.trim()) {
        toast.error(t("serialNumberRequired"));
        return;
      }
      
      toast.info(t("pairingInProgress"));
      
      // Placeholder for API calls - will be implemented later
      /* TODO REST:/api/boards/pair */  
      /* TODO WS:pair_board */
      
      console.log('Pairing board with serial number:', serialNumber);
      
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && isScanning) {
      stop();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
              variant={pairingMethod === 'camera' ? 'default' : 'outline'} 
              className={pairingMethod === 'camera' ? 'bg-chess-accent text-chess-text-light' : ''}
              onClick={() => {
                setPairingMethod('camera');
                if (!isScanning) {
                  start('qr-reader');
                }
              }}
              disabled={cameraPermissionDenied}
            >
              <Camera className="mr-2 h-4 w-4" />
              {t("scanQRCode")}
            </Button>
            <Button 
              variant={pairingMethod === 'manual' ? 'default' : 'outline'}
              className={pairingMethod === 'manual' ? 'bg-chess-accent text-chess-text-light' : ''}
              onClick={() => {
                setPairingMethod('manual');
                stop();
              }}
            >
              <Cpu className="mr-2 h-4 w-4" />
              {t("enterSerialNumber")}
            </Button>
          </div>
          
          {pairingMethod === 'camera' ? (
            <div className="flex flex-col items-center justify-center">
              <div 
                id="qr-reader" 
                ref={qrContainerRef} 
                className="w-full max-w-sm overflow-hidden rounded-lg border border-chess-accent/50"
                style={{ height: '280px' }}
              ></div>
              
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <p className="text-sm">{t("scannerError")}</p>
                </div>
              )}
              
              <p className="text-center text-sm mt-2 text-chess-text-dark/80">
                {t("scanQRInstructions")}
              </p>
              
              {serialNumber && (
                <div className="mt-3 w-full">
                  <label className="text-sm font-medium">
                    {t("detectedSerialNumber")}
                  </label>
                  <Input
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="bg-white border-chess-accent/30 mt-1"
                  />
                </div>
              )}
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
