"use client";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useRef, useState } from "react";

export type AudioSelection = {
  selectedVoices: string[];
  isSolo: boolean;
  isFocus: boolean;
};

type Props = {
  audioSelection: AudioSelection;
  voices: string[];
};

export default function AudioPlayer({ audioSelection, voices }: Props) {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [currentTime, setCurrentTime] = useState(0);

  const sync = (position: number) => {
    voices.forEach((voice) => {
      const audioElement = audioRefs.current?.[voice];
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.currentTime = Math.round(position);
      }
    });
  };

  const play = () => {
    voices.forEach((voice) => {
      const audioElement = audioRefs.current?.[voice];
      if (audioElement) {
        audioElement.volume = audioSelection.selectedVoices.includes(voice)
          ? 0.6
          : 0;
        audioElement.play();
      }
    });
  };

  const stop = () => {
    let lastSeekerPos = 0;

    voices.forEach((voice) => {
      const audioElement = audioRefs.current?.[voice];
      if (audioElement) {
        if (!audioElement.paused) {
          lastSeekerPos = Math.floor(audioElement.currentTime);
        }
        audioElement.pause();
      }
    });

    setCurrentTime(lastSeekerPos);
  };
  return (
    <Box sx={{ margin: 1 }}>
      <Slider
        value={currentTime}
        defaultValue={currentTime}
        aria-label="Disabled slider"
        onChange={(_, value) => {
          setCurrentTime(value as number);
          sync(value as number);
        }}
      />
      <pre>{currentTime}</pre>
      {voices.map((voice, index) => (
        <Box component="div" key={voice} sx={{ display: "block" }}>
          <audio
            controls
            preload="auto"
            key={index}
            mediaGroup="a11y_vid"
            ref={(ref) => {
              audioRefs.current[voice] = ref;
            }}
          >
            <source src={`/audio/${voice}.mp3`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      ))}

      <Box display="flex" gap={2}>
        <Button variant="contained" endIcon={<PlayArrowIcon />} onClick={play}>
          Play
        </Button>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<PlayArrowIcon />}
          onClick={stop}
        >
          Stop
        </Button>
      </Box>
    </Box>
  );
}
