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
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow
                sx={(theme) => ({
                  backgroundColor: theme.palette.primary.main,
                })}
              >
                <TableCell sx={{ color: "white" }}>Stimme</TableCell>
                <TableCell sx={{ color: "white" }}>An</TableCell>
                <TableCell sx={{ color: "white" }}>
                  In den Vordergrund
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {VOICES.map((voice) => (
                <StyledTableRow key={voice}>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <span>{voice}</span>
                      <a href={`/audio/${voice}.mp3`} download={true}>
                        (Download)
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <CheckBox
                      disabled={!!soloVoice}
                      checked={selectedVoices.includes(voice)}
                      onChange={(_, state) => onSelectVoice(voice, state)}
                      sx={{ marginLeft: -1.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Radio
                      sx={{ marginLeft: -1.5 }}
                      checked={soloVoice === voice}
                      onClick={() => toggleSolo(voice)}
                    />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
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
