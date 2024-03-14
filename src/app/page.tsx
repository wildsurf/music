"use client";

import styles from "./page.module.css";
import { useRef, useState } from "react";
import AudioPlayer, { AudioSelection } from "./audio-player";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import CheckBox from "@mui/material/Checkbox";
import { styled } from "@mui/material";

const VOICES = ["Sopran", "Alt", "Tenor", "Bass"];
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "& td:first-child": {
    backgroundColor: theme.palette.action.hover,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export default function Home() {
  const [audioSelection, setAudioSelection] = useState<AudioSelection>({
    selectedVoices: [...VOICES],
    isSolo: false,
    isFocus: false,
  });

  const onSelectVoice = (voice: string, turnOn: boolean) => {
    if (turnOn) {
      setAudioSelection({
        ...audioSelection,
        selectedVoices: [...audioSelection.selectedVoices, voice],
      });
    } else {
      setAudioSelection({
        ...audioSelection,
        selectedVoices: audioSelection.selectedVoices.filter(
          (v) => v !== voice
        ),
      });
    }
  };

  return (
    <main className={styles.main}>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Stimme</TableCell>
                <TableCell>An</TableCell>
                <TableCell>Solo</TableCell>
                <TableCell>Fokus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {VOICES.map((voice) => (
                <StyledTableRow key={voice}>
                  <TableCell>{voice}</TableCell>
                  <TableCell>
                    <CheckBox
                      checked={audioSelection.selectedVoices.includes(voice)}
                      onChange={(_, state) => onSelectVoice(voice, state)}
                    />
                  </TableCell>
                  <TableCell>
                    <CheckBox />
                  </TableCell>
                  <TableCell>
                    <CheckBox />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions>
          <AudioPlayer audioSelection={audioSelection} voices={VOICES} />
        </CardActions>
      </Card>
    </main>
  );
}
