
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
import { Cpu, Camera } from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

const SmartBoardPairingModal: React.FC = () => {
  const { t } = useLanguageContext();
  const [serialNumber, setSerialNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [pairingMethod, setPairingMethod] = useState<'camera' | 'manual'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Clean up scanner when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    };
  }, [isScanning]);

  useEffect(() => {
    if (!isOpen && scannerRef.current && isScanning) {
      scannerRef.current.stop().catch(error => {
        console.error("Error stopping scanner:", error);
      });
      setIsScanning(false);
    }

    if (isOpen && pairingMethod === 'camera' && !isScanning) {
      startScanner();
    }
  }, [isOpen, pairingMethod]);

  const startScanner = async () => {
    if (!qrContainerRef.current) return;
    
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
      }

      scannerRef.current = new Html5Qrcode("qr-reader");
      
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          // QR Code scanned successfully
          handleQrCodeSuccess(decodedText);
        },
        (errorMessage) => {
          // QR Code scanning continues, only log errors if needed
          console.log(errorMessage);
        }
      );
      
      setIsScanning(true);
    } catch (error) {
      console.error("Error starting QR scanner:", error);
      toast.error(t("cameraAccessFailed"));
      setPairingMethod('manual');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const handleQrCodeSuccess = (decodedText: string) => {
    setSerialNumber(decodedText);
    toast.info(t("qrCodeDetected"));
    
    // Optionally auto-pair when QR code is detected
    // handleSubmit();
  };

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
      stopScanner();
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
                  setTimeout(() => {
                    startScanner();
                  }, 300);
                }
              }}
            >
              <Camera className="mr-2 h-4 w-4" />
              {t("scanQRCode")}
            </Button>
            <Button 
              variant={pairingMethod === 'manual' ? 'default' : 'outline'}
              className={pairingMethod === 'manual' ? 'bg-chess-accent text-chess-text-light' : ''}
              onClick={() => {
                setPairingMethod('manual');
                stopScanner();
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
