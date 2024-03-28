"use client";
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
import { VoiceFieldsFragment } from "@/lib/__generated/sdk";

type Props = {
  voices: VoiceFieldsFragment[];
  selectedVoices: string[];
  soloVoice?: string;
  onSelectVoice: (voice: string, turnOn: boolean) => void;
  toggleSolo: (voice: string) => void;
};

export default function VoicesList({
  voices,
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
      {voices.map((voice) => {
        const voiceName = voice.name ?? "";
        const isVolumeOn = selectedVoices.includes(voiceName);
        const isSoloVoice = voiceName === soloVoice;
        const audios = voice.audiosCollection?.items ?? [];
        return (
          <Fragment key={voiceName}>
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
                    disabled={!audios?.[0]?.media?.url}
                    aria-label="Download"
                    href={audios?.[0]?.media?.url ?? ""}
                    download
                    target="_blank"
                  >
                    <Download />
                  </IconButton>
                  <Typography variant="h6">{voiceName}</Typography>
                </Box>

                <Box display={"flex"} gap={1} sx={{ alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color={isSoloVoice ? "primary" : "info"}
                    onClick={() => toggleSolo(voiceName)}
                  >
                    Solo
                  </Button>
                  <Button
                    color={isVolumeOn ? "primary" : "info"}
                    aria-label="Volumen an/aus"
                    size="small"
                    variant="contained"
                    onClick={() => onSelectVoice(voiceName, !isVolumeOn)}
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
