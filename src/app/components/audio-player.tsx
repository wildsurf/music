"use client";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useCallback, useEffect, useRef, useState } from "react";
import { VoiceFieldsFragment } from "@/lib/__generated/sdk";

type Props = {
  voices: VoiceFieldsFragment[];
  selectedVoices: string[];
  soloVoice?: string;
};

export default function AudioPlayer({
  voices,
  selectedVoices,
  soloVoice,
}: Props) {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("");

  const sync = (position: number) => {
    if (isPlaying) {
      pause();
    }

    voices.forEach((voice) => {
      const audioElement = audioRefs.current?.[voice.name!];
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
    for (let i = 0; i < voices.length; i++) {
      const voice = voices[i];
      const voiceName = voice.name!;
      const audioElement = audioRefs.current?.[voiceName];

      if (audioElement) {
        audioElement.play();
        if (!soloVoice) {
          audioElement.volume = selectedVoices.includes(voiceName) ? 1 : 0;
        } else if (voice.name === soloVoice) {
          audioElement.volume = 1;
        } else {
          audioElement.volume = 0.1;
        }
      }
    }
  }, [selectedVoices, soloVoice, voices]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    voices.forEach((voice) => {
      audioRefs.current?.[voice.name!]?.pause();
    });
  }, [voices]);

  // Load audio
  useEffect(() => {
    audioRefs.current = {};
    voices.forEach((voice) => {
      const audios =
        voice.audiosCollection?.items.filter(
          (a) => a?.type?.fileExtension === "mp3"
        ) ?? [];

      const audio = new Audio(audios[0]?.media?.url ?? "");
      audio.oncanplaythrough = function () {
        audioRefs.current[voice.name ?? ""] = audio;
        setAudioDuration(audio.duration);
      };
      audio.onerror = console.error;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const audioElement = audioRefs.current?.[voices[0].name!];

      if (audioElement) {
        const currentTime = audioElement.currentTime;
        setCurrentTime(currentTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [voices]);

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
            max={audioDuration}
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
