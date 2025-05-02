
// Audio effect service for chess game
class AudioService {
  private moveSound: HTMLAudioElement | null = null;
  private captureSound: HTMLAudioElement | null = null;
  private checkSound: HTMLAudioElement | null = null;
  private notificationSound: HTMLAudioElement | null = null;
  private errorSound: HTMLAudioElement | null = null;
  private gameStartSound: HTMLAudioElement | null = null;
  private gameEndSound: HTMLAudioElement | null = null;
  private navigationSound: HTMLAudioElement | null = null;
  private victorySound: HTMLAudioElement | null = null;
  private defeatSound: HTMLAudioElement | null = null;
  private drawSound: HTMLAudioElement | null = null;
  private turnSound: HTMLAudioElement | null = null;
  private timerWarningSound: HTMLAudioElement | null = null;
  
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
      this.navigationSound = new Audio('/sounds/navigation.mp3');
      this.victorySound = new Audio('/sounds/victory.mp3');
      this.defeatSound = new Audio('/sounds/defeat.mp3');
      this.drawSound = new Audio('/sounds/draw.mp3');
      this.turnSound = new Audio('/sounds/turn.mp3');
      this.timerWarningSound = new Audio('/sounds/timer-warning.mp3');
      
      // Preload sounds
      this.preloadSounds();
    }
  }
  
  private preloadSounds(): void {
    const sounds = [
      this.moveSound,
      this.captureSound,
      this.checkSound,
      this.notificationSound,
      this.errorSound,
      this.gameStartSound,
      this.gameEndSound,
      this.navigationSound,
      this.victorySound,
      this.defeatSound,
      this.drawSound,
      this.turnSound,
      this.timerWarningSound
    ];
    
    sounds.forEach(sound => {
      if (sound) sound.load();
    });
  }
  
  private playSound(sound: HTMLAudioElement | null): void {
    if (!this.isMuted && sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error(`Failed to play sound: ${err}`));
    }
  }
  
  public playMoveSound(): void {
    this.playSound(this.moveSound);
  }
  
  public playCaptureSound(): void {
    this.playSound(this.captureSound);
  }
  
  public playCheckSound(): void {
    this.playSound(this.checkSound);
  }
  
  public playNotificationSound(): void {
    this.playSound(this.notificationSound);
  }
  
  public playErrorSound(): void {
    this.playSound(this.errorSound);
  }
  
  public playGameStartSound(): void {
    this.playSound(this.gameStartSound);
  }
  
  public playGameEndSound(): void {
    this.playSound(this.gameEndSound);
  }
  
  public playNavigationSound(): void {
    this.playSound(this.navigationSound);
  }
  
  public playVictorySound(): void {
    this.playSound(this.victorySound);
  }
  
  public playDefeatSound(): void {
    this.playSound(this.defeatSound);
  }
  
  public playDrawSound(): void {
    this.playSound(this.drawSound);
  }
  
  public playTurnSound(): void {
    this.playSound(this.turnSound);
  }
  
  public playTimerWarningSound(): void {
    this.playSound(this.timerWarningSound);
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
