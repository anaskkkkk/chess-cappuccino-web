
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface UseQrScannerOptions {
  onSuccess?: (decodedText: string) => void;
  onError?: (error: string) => void;
  qrboxSize?: number;
  facingMode?: 'environment' | 'user';
  timeoutSeconds?: number;
}

export const useQrScanner = ({
  onSuccess,
  onError,
  qrboxSize = 250,
  facingMode = 'environment',
  timeoutSeconds = 30
}: UseQrScannerOptions = {}) => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const start = async (elementId: string) => {
    if (isScanning) return;
    
    setScannedCode(null);
    setError(null);
    setCameraPermissionDenied(false);
    
    try {
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('No camera found');
      }
      
      // Create scanner if it doesn't exist
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(elementId);
      }
      
      // Set scanning timeout
      if (timeoutSeconds > 0) {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = window.setTimeout(() => {
          if (isScanning && !scannedCode) {
            const timeoutError = 'QR code scanning timed out';
            setError(timeoutError);
            stop();
            if (onError) onError(timeoutError);
          }
        }, timeoutSeconds * 1000);
      }

      // Start scanning
      await scannerRef.current.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1
        },
        (decodedText) => {
          setScannedCode(decodedText);
          if (onSuccess) onSuccess(decodedText);
          stop(); // Auto-stop after successful scan
        },
        (errorMessage) => {
          // This is just for decoding errors, not for critical failures
          console.log(errorMessage);
        }
      );
      
      setIsScanning(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera';
      
      // Check if it's a permission denial
      if (errorMessage.includes('Permission denied') || 
          errorMessage.includes('not allowed') ||
          errorMessage.includes('permission')) {
        setCameraPermissionDenied(true);
      }
      
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  const stop = async () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    };
  }, [isScanning]);

  return {
    scannedCode,
    error,
    isScanning,
    cameraPermissionDenied,
    start,
    stop
  };
};
