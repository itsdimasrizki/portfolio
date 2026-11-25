"use client";

import { useState } from "react";
import { Music } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  spotifyUri: string;
}

const SPOTIFY_TRACKS: Track[] = [
  {
    id: "track-1",
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    spotifyUri: "0yc6Gst2xkRu0eMLeRMGCX",
  },
  {
    id: "track-2",
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    spotifyUri: "7MXVkk9YM5IZxh0WSlVIh0",
  },
  {
    id: "track-3",
    title: "Midnight City",
    artist: "M83",
    spotifyUri: "6GyFP1nfCDB8Jyik2z8ioe",
  },
  {
    id: "track-4",
    title: "Resonance",
    artist: "HOME",
    spotifyUri: "1Tu2G0XQ6p21rGZ8f5399v",
  },
];

export function SpotifyPlayer() {
  const [selectedTrack, setSelectedTrack] = useState<Track>(SPOTIFY_TRACKS[0]);

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            CURRENTLY VIBING TO
          </span>
        </div>
        <Music className="h-4 w-4 text-primary" />
      </div>

      {/* Spotify Embed Player */}
      <div className="mt-4 overflow-hidden rounded-xl bg-background/50">
        <iframe
          src={`https://open.spotify.com/embed/track/${selectedTrack.spotifyUri}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Spotify - ${selectedTrack.title}`}
          className="rounded-xl"
        />
      </div>

      {/* Track Selection Buttons */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {SPOTIFY_TRACKS.map((track, idx) => {
          const isCurrent = track.id === selectedTrack.id;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-mono transition-colors ${
                isCurrent
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border border-border/80 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              0{idx + 1} {track.title}
            </button>
          );
        })}
      </div>

      {/* Personal Tech Philosophy Quote */}
      <div className="mt-6 border-t border-border/60 pt-4">
        <p className="font-display text-sm italic text-foreground leading-relaxed">
          &ldquo;Building software that genuinely understands people is far more interesting than building software that only understands code.&rdquo;
        </p>
        <span className="mt-1 block font-mono text-xs text-primary">
          — Dimas Rizki
        </span>
      </div>
    </div>
  );
}
