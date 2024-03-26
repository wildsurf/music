"use client";
import { VOICES } from "./config";
import List from "@mui/material/List";
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  Typography,
  useTheme,
} from "@mui/material";
import { Download, VolumeDown } from "@mui/icons-material";
import { Fragment } from "react";

type Props = {
  selectedVoices: string[];
  soloVoice?: string;
  onSelectVoice: (voice: string, turnOn: boolean) => void;
  toggleSolo: (voice: string) => void;
};

export default function TrackList({
  selectedVoices,
  soloVoice,
  onSelectVoice,
  toggleSolo,
}: Props) {
  const theme = useTheme();

  return (
    <List
      sx={{
        borderRadius: 3,
        width: "100%",
        margin: 0,
        maxWidth: 360,
        bgcolor: "white",
        padding: 0,
      }}
    >
      {VOICES.map((voice) => {
        const isVolumeOn = selectedVoices.includes(voice);
        const isSoloVoice = voice === soloVoice;
        return (
          <Fragment key={voice}>
            <ListItem
              sx={{
                padding: 0,
                width: "100%",
              }}
            >
              <Box
                display="flex"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                  width: "100%",
                }}
              >
                <Box display={"flex"} sx={{ alignItems: "center" }}>
                  <IconButton
                    aria-label="Download"
                    href={`/audio/${voice}.mp3`}
                  >
                    <Download />
                  </IconButton>
                  <Typography variant="h6">{voice}</Typography>
                </Box>

                <Box display={"flex"} gap={1} sx={{ alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color={isSoloVoice ? "primary" : "info"}
                    onClick={() => toggleSolo(voice)}
                  >
                    Solo
                  </Button>
                  <Button
                    color={isVolumeOn ? "primary" : "info"}
                    aria-label="Volumen an/aus"
                    size="small"
                    variant="contained"
                    onClick={() => onSelectVoice(voice, !isVolumeOn)}
                    disabled={!!soloVoice}
                  >
                    <VolumeDown />
                  </Button>
                </Box>
              </Box>
            </ListItem>
            <Divider variant="inset" component="li" sx={{ margin: 0 }} />
          </Fragment>
        );
      })}
    </List>
  );
}
