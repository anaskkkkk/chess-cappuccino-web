
// Audio effect service for chess game
class AudioService {
  private moveSound: HTMLAudioElement | null = null;
  private captureSound: HTMLAudioElement | null = null;
  private checkSound: HTMLAudioElement | null = null;
  private notificationSound: HTMLAudioElement | null = null;
  private errorSound: HTMLAudioElement | null = null;
  private gameStartSound: HTMLAudioElement | null = null;
  private gameEndSound: HTMLAudioElement | null = null;
  
  private isMuted: boolean = false;
  
  constructor() {
    this.initSounds();
  }
  
  private initSounds(): void {
    if (typeof window !== 'undefined') {
      // Create audio elements
      this.moveSound = new Audio('/sounds/move.mp3');
      this.captureSound = new Audio('/sounds/capture.mp3');
      this.checkSound = new Audio('/sounds/check.mp3');
      this.notificationSound = new Audio('/sounds/notification.mp3');
      this.errorSound = new Audio('/sounds/error.mp3');
      this.gameStartSound = new Audio('/sounds/game-start.mp3');
      this.gameEndSound = new Audio('/sounds/game-end.mp3');
      
      // Preload sounds
      this.moveSound.load();
      this.captureSound.load();
      this.checkSound.load();
      this.notificationSound.load();
      this.errorSound.load();
      this.gameStartSound.load();
      this.gameEndSound.load();
    }
  }
  
  public playMoveSound(): void {
    if (!this.isMuted && this.moveSound) {
      this.moveSound.currentTime = 0;
      this.moveSound.play().catch(err => console.error('Failed to play move sound:', err));
    }
  }
  
  public playCaptureSound(): void {
    if (!this.isMuted && this.captureSound) {
      this.captureSound.currentTime = 0;
      this.captureSound.play().catch(err => console.error('Failed to play capture sound:', err));
    }
  }
  
  public playCheckSound(): void {
    if (!this.isMuted && this.checkSound) {
      this.checkSound.currentTime = 0;
      this.checkSound.play().catch(err => console.error('Failed to play check sound:', err));
    }
  }
  
  public playNotificationSound(): void {
    if (!this.isMuted && this.notificationSound) {
      this.notificationSound.currentTime = 0;
      this.notificationSound.play().catch(err => console.error('Failed to play notification sound:', err));
    }
  }
  
  public playErrorSound(): void {
    if (!this.isMuted && this.errorSound) {
      this.errorSound.currentTime = 0;
      this.errorSound.play().catch(err => console.error('Failed to play error sound:', err));
    }
  }
  
  public playGameStartSound(): void {
    if (!this.isMuted && this.gameStartSound) {
      this.gameStartSound.currentTime = 0;
      this.gameStartSound.play().catch(err => console.error('Failed to play game start sound:', err));
    }
  }
  
  public playGameEndSound(): void {
    if (!this.isMuted && this.gameEndSound) {
      this.gameEndSound.currentTime = 0;
      this.gameEndSound.play().catch(err => console.error('Failed to play game end sound:', err));
    }
  }
  
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
  
  public setMute(mute: boolean): void {
    this.isMuted = mute;
  }
  
  public isMutedStatus(): boolean {
    return this.isMuted;
  }
}

// Export a singleton instance
const audioService = new AudioService();
export default audioService;
