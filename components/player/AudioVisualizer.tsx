"use client";

import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  className?: string;
  mode?: "bars" | "wave" | "radial";
}

export function AudioVisualizer({
  audioElement,
  isPlaying,
  className = "",
  mode = "bars",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;

      if (!analyserRef.current) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyserRef.current = analyser;
      }

      if (!sourceRef.current) {
        const source = ctx.createMediaElementSource(audioElement);
        source.connect(analyserRef.current);
        analyserRef.current.connect(ctx.destination);
        sourceRef.current = source;
      }
    } catch {
      // AudioContext may be restricted by autoplay or cross-origin audio
    }
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const analyser = analyserRef.current;

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      canvasCtx.clearRect(0, 0, width, height);

      if (!analyser || !isPlaying) {
        // Render idle gentle pulse line
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, height / 2);
        canvasCtx.lineTo(width, height / 2);
        canvasCtx.strokeStyle = "rgba(184, 255, 0, 0.2)";
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      if (mode === "bars") {
        analyser.getByteFrequencyData(dataArray);
        const barWidth = (width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height;

          // Gradient from Radium Green to Cyan
          const gradient = canvasCtx.createLinearGradient(
            0,
            height - barHeight,
            0,
            height
          );
          gradient.addColorStop(0, "#B8FF00");
          gradient.addColorStop(0.5, "#00F5FF");
          gradient.addColorStop(1, "#7C3AED");

          canvasCtx.fillStyle = gradient;
          canvasCtx.shadowColor = "rgba(184, 255, 0, 0.5)";
          canvasCtx.shadowBlur = 6;
          canvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

          x += barWidth;
        }
      } else {
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.lineWidth = 2.5;
        canvasCtx.strokeStyle = "#B8FF00";
        canvasCtx.shadowColor = "#B8FF00";
        canvasCtx.shadowBlur = 10;
        canvasCtx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        canvasCtx.lineTo(width, height / 2);
        canvasCtx.stroke();
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={48}
      className={`rounded-lg bg-transparent ${className}`}
    />
  );
}
