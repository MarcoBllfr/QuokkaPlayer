export interface SongInfo {
  id: number;
  title: string;
  artist: string;
  album?: string;
  url: string;  
  cover?: string;  
  duration: number;  
}