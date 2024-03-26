"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import CardHeader from "@mui/material/CardHeader";
import CheckBox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material";
import { VOICES } from "./config";
import TrackList from "./track-list";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "& td:first-child": {
    backgroundColor: theme.palette.action.hover,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export default function Home() {
  const [audioDuration, setAudioDuration] = useState<number>();
  const [selectedVoices, setSelectedVoices] = useState<string[]>([...VOICES]);
  const [soloVoice, setSoloVoice] = useState<string>();

  useEffect(() => {
    const audio = new Audio(`/audio/${VOICES[0]}.mp3`);

    audio.oncanplaythrough = function () {
      setAudioDuration(audio.duration);
    };
  }, []);

  const onSelectVoice = (voice: string, turnOn: boolean) => {
    if (turnOn) {
      setSelectedVoices([...selectedVoices, voice]);
    } else {
      setSelectedVoices(selectedVoices.filter((v) => v !== voice));
    }
  };

  const toggleSolo = (voice: string) => {
    setSelectedVoices([...VOICES]);
    setSoloVoice(soloVoice === voice ? undefined : voice);
  };

  return (
    <main className={styles.main}>
      <Card
        sx={(theme) => ({
          margin: 3,
          backgroundColor: theme.palette.background.paper,
        })}
      >
        <CardHeader
          title="Denn er hat seinen Engeln (Mendelssohn)"
          subheader="4-stimmiger Satz von M. Sandner"
        />
        <CardContent>
          <TrackList
            selectedVoices={selectedVoices}
            soloVoice={soloVoice}
            toggleSolo={toggleSolo}
            onSelectVoice={onSelectVoice}
          />
        </CardContent>
        <CardActions>
          <AudioPlayer
            soloVoice={soloVoice}
            selectedVoices={selectedVoices}
            audioLength={audioDuration ?? 0}
          />
        </CardActions>
      </Card>
    </main>
  );
}
