"use client";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useCallback, useEffect, useRef, useState } from "react";
import { VOICES } from "./config";

type Props = {
  selectedVoices: string[];
  audioLength: number;
  soloVoice?: string;
};

export default function AudioPlayer({
  audioLength,
  selectedVoices,
  soloVoice,
}: Props) {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("");

  const sync = (position: number) => {
    if (isPlaying) {
      pause();
    }

    VOICES.forEach((voice) => {
      const audioElement = audioRefs.current?.[voice];
      if (audioElement) {
        audioElement.currentTime = position;
      }
    });

    if (isPlaying) {
      play();
    }
  };

  const play = useCallback(() => {
    setIsPlaying(true);
    for (let i = 0; i < VOICES.length; i++) {
      const voice = VOICES[i];
      const audioElement = audioRefs.current?.[voice];
      if (audioElement) {
        audioElement.play();
        if (!soloVoice) {
          audioElement.volume = selectedVoices.includes(voice) ? 1 : 0;
        } else if (voice === soloVoice) {
          audioElement.volume = 1;
        } else {
          audioElement.volume = 0.1;
        }
      }
    }
  }, [selectedVoices, soloVoice]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    VOICES.forEach((voice) => {
      audioRefs.current?.[voice]?.pause();
    });
  }, []);

  // Load audio
  useEffect(() => {
    audioRefs.current = {};
    VOICES.forEach((voice) => {
      const audio = new Audio(`/audio/${voice}.mp3`);
      audio.oncanplaythrough = function () {
        audioRefs.current[voice] = audio;
      };
    });
  }, []);

  // Calculate formatted time based on current time
  useEffect(() => {
    const currentTimeRounded = Math.floor(currentTime);
    const mins = Math.floor(currentTimeRounded / 60);
    const seconds = String(currentTimeRounded % 60).padStart(2, "0");
    setCurrentTimeFormatted(`${mins}:${seconds}`);
  }, [currentTime]);

  // Keep time scroller up-to-date
  useEffect(() => {
    const interval = setInterval(() => {
      const audioElement = audioRefs.current?.[VOICES[0]];

      if (audioElement) {
        const currentTime = audioElement.currentTime;
        setCurrentTime(currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // update play based on the chosen voice settings
  useEffect(() => {
    if (isPlaying) {
      pause();
      play();
    }
  }, [selectedVoices, soloVoice, play, pause, isPlaying]);

  return (
    <Box sx={{ marginX: 1, width: "100%" }}>
      <Box
        flex="column"
        sx={(theme) => ({
          padding: 2,
          border: "1px solid grey",
          borderColor: theme.palette.grey[400],
          borderRadius: 4,
        })}
      >
        <Box sx={{ marginX: 2 }}>
          <Slider
            value={currentTime}
            defaultValue={currentTime}
            max={audioLength}
            onChange={(_, value) => {
              setCurrentTime(value as number);
              sync(value as number);
            }}
          />
        </Box>
        <Chip label={currentTimeFormatted} sx={{ marginLeft: 1 }} />
      </Box>

      <Box display="flex" gap={2} sx={{ marginY: 3 }}>
        <Button variant="contained" endIcon={<PlayArrowIcon />} onClick={play}>
          Abspielen
        </Button>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<PlayArrowIcon />}
          onClick={pause}
        >
          Pause
        </Button>
      </Box>
    </Box>
  );
}
