"use client";
import { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import VoicesList from "./voices-list";
import { SongFieldsFragment, VoiceFieldsFragment } from "@/lib/__generated/sdk";

type Props = {
  song: SongFieldsFragment;
};

export default function PageLayout({ song }: Props) {
  const voices = (song.voicesCollection?.items ?? []).filter(
    (v) => !!v
  ) as VoiceFieldsFragment[];
  const voiceNames = voices.map((v) => v.name ?? "");

  const [selectedVoices, setSelectedVoices] = useState<string[]>([
    ...voiceNames,
  ]);
  const [soloVoice, setSoloVoice] = useState<string>();

  const onSelectVoice = (voice: string, turnOn: boolean) => {
    if (turnOn) {
      setSelectedVoices([...selectedVoices, voice]);
    } else {
      setSelectedVoices(selectedVoices.filter((v) => v !== voice));
    }
  };

  const toggleSolo = (voice: string) => {
    setSelectedVoices([...voiceNames]);
    setSoloVoice(soloVoice === voice ? undefined : voice);
  };

  return (
    <main>
      <Card
        sx={(theme) => ({
          margin: 3,
          backgroundColor: theme.palette.background.paper,
        })}
      >
        <CardHeader title={song.title} subheader={song.subheading} />
        <CardContent>
          <VoicesList
            voices={voices}
            selectedVoices={selectedVoices}
            soloVoice={soloVoice}
            toggleSolo={toggleSolo}
            onSelectVoice={onSelectVoice}
          />
        </CardContent>
        <CardActions>
          <AudioPlayer
            voices={voices}
            soloVoice={soloVoice}
            selectedVoices={selectedVoices}
          />
        </CardActions>
      </Card>
    </main>
  );
}
