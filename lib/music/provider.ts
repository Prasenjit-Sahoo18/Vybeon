import { Track, Artist, Album, Genre } from "@/types";

export interface MusicSearchOptions {
  query: string;
  type?: "all" | "tracks" | "artists" | "albums";
  limit?: number;
  offset?: number;
}

export interface MusicProvider {
  name: string;
  getTrack(id: string): Promise<Track | null>;
  searchTracks(options: MusicSearchOptions): Promise<Track[]>;
  getArtist(id: string): Promise<Artist | null>;
  getArtistTopTracks(artistId: string): Promise<Track[]>;
  getAlbum(id: string): Promise<Album | null>;
  getGenres(): Promise<Genre[]>;
  getTrending(): Promise<Track[]>;
}
