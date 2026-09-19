import { MusicProvider, MusicSearchOptions } from "./provider";
import { Track, Artist, Album, Genre } from "@/types";
import { prisma } from "@/lib/db/prisma";

export class DemoMusicProvider implements MusicProvider {
  name = "DemoMusicProvider";

  async getTrack(id: string): Promise<Track | null> {
    try {
      const track = await prisma.track.findUnique({
        where: { id },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
      });
      if (!track) return null;
      return {
        ...track,
        genres: track.genres.map((tg) => tg.genre),
      } as Track;
    } catch {
      return null;
    }
  }

  async searchTracks(options: MusicSearchOptions): Promise<Track[]> {
    try {
      const tracks = await prisma.track.findMany({
        where: {
          OR: [
            { title: { contains: options.query, mode: "insensitive" } },
            { artist: { name: { contains: options.query, mode: "insensitive" } } },
          ],
        },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        take: options.limit ?? 20,
        skip: options.offset ?? 0,
      });

      return tracks.map((track) => ({
        ...track,
        genres: track.genres.map((tg) => tg.genre),
      })) as Track[];
    } catch {
      return [];
    }
  }

  async getArtist(id: string): Promise<Artist | null> {
    try {
      const artist = await prisma.artist.findUnique({
        where: { id },
      });
      return artist as Artist | null;
    } catch {
      return null;
    }
  }

  async getArtistTopTracks(artistId: string): Promise<Track[]> {
    try {
      const tracks = await prisma.track.findMany({
        where: { artistId },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        orderBy: { playCount: "desc" },
        take: 10,
      });

      return tracks.map((track) => ({
        ...track,
        genres: track.genres.map((tg) => tg.genre),
      })) as Track[];
    } catch {
      return [];
    }
  }

  async getAlbum(id: string): Promise<Album | null> {
    try {
      const album = await prisma.album.findUnique({
        where: { id },
        include: {
          artist: true,
          tracks: {
            include: {
              artist: true,
              genres: { include: { genre: true } },
            },
          },
        },
      });
      return album as unknown as Album | null;
    } catch {
      return null;
    }
  }

  async getGenres(): Promise<Genre[]> {
    try {
      return await prisma.genre.findMany();
    } catch {
      return [];
    }
  }

  async getTrending(): Promise<Track[]> {
    try {
      const tracks = await prisma.track.findMany({
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        orderBy: { playCount: "desc" },
        take: 20,
      });

      return tracks.map((track) => ({
        ...track,
        genres: track.genres.map((tg) => tg.genre),
      })) as Track[];
    } catch {
      return [];
    }
  }
}

export const musicProvider = new DemoMusicProvider();
