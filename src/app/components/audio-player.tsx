"use client";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VoiceFieldsFragment } from "@/lib/__generated/sdk";
import { Mixer, TrackConfig } from "../utils/mixer";

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
  const trackConfig: TrackConfig[] = useMemo(
    () =>
      voices.map((v) => {
        const media = v.audiosCollection?.items.filter(
          (a) => a?.type?.fileExtension === "mp3"
        )[0]?.media;
        return {
          id: v.name!,
          url: media?.url ?? "",
          type: media?.contentType ?? "",
        };
      }),
    [voices]
  );

  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("");

  const mixer = useRef<Mixer>();

  const updateMixer = useCallback(() => {
    voices.forEach((voice) => {
      const voiceName = voice.name!;
      let volume = 0;

      if (!soloVoice) {
        volume = selectedVoices.includes(voiceName) ? 1 : 0;
      } else if (voice.name === soloVoice) {
        volume = 1;
      } else {
        volume = 0.2;
      }

      mixer.current?.changeTrackVolume(voiceName, volume);
    });
  }, [selectedVoices, soloVoice, voices]);

  // initialise the mixer
  useEffect(() => {
    const setCurrentTimeRounded = (progress: number) => {
      setCurrentTime(Math.round(progress * 10) / 10);
    };

    mixer.current = new Mixer(
      trackConfig,
      setAudioDuration,
      setCurrentTimeRounded
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate formatted time based on current time
  useEffect(() => {
    const currentTimeRounded = Math.floor(currentTime);
    const mins = Math.floor(currentTimeRounded / 60);
    const seconds = String(currentTimeRounded % 60).padStart(2, "0");
    setCurrentTimeFormatted(`${mins}:${seconds}`);
  }, [currentTime]);

  // update play based on the chosen voice settings
  useEffect(() => {
    if (audioDuration) {
      updateMixer();
    }
  }, [selectedVoices, soloVoice, updateMixer, audioDuration]);

  return (
    <Box sx={{ marginX: 1, width: "100%" }}>
      <audio controls id="hidden-audio" style={{ display: "none" }}>
        <source src={trackConfig[0].url} type={trackConfig[0].type} />
        Your browser does not support the audio tag.
      </audio>
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
            disabled={audioDuration === 0}
            value={currentTime}
            defaultValue={currentTime}
            max={audioDuration}
            onChange={(_, value) => {
              setCurrentTime(value as number);
              mixer.current?.changePlayHead(value as number);
            }}
          />
        </Box>
        <Chip label={currentTimeFormatted} sx={{ marginLeft: 1 }} />
      </Box>

      <Box display="flex" gap={2} sx={{ marginY: 3 }}>
        <Button
          variant="contained"
          endIcon={<PlayArrowIcon />}
          onClick={() => mixer.current?.play()}
          disabled={audioDuration === 0}
        >
          Abspielen
        </Button>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<PlayArrowIcon />}
          onClick={() => mixer.current?.stop()}
        >
          Pause
        </Button>
      </Box>
    </Box>
  );
}
