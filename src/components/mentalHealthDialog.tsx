import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import { fetchRecreationalActivities } from "../api/All_api"; // Ensure the path is correct

interface MentalHealthDialogProps {
  open: boolean;
  onClose: () => void;
}

const MentalHealthDialog: React.FC<MentalHealthDialogProps> = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchActivities(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location", error);
          setLoading(false); // Allow user to enter location manually
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []); // Empty dependency array ensures it's only created once

  useEffect(() => {
    if (open) {
      getUserLocation();
    }
  }, [open, getUserLocation]);

  const fetchActivities = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const messageData = await fetchRecreationalActivities(
        latitude,
        longitude
      );
      setMessage(messageData);
    } catch (error) {
      console.error("Failed to fetch activities", error);
      setMessage("Failed to fetch activities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocationSubmit = () => {
    if (manualLocation) {
      const lat = parseFloat(manualLocation.latitude);
      const lng = parseFloat(manualLocation.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        fetchActivities(lat, lng);
      } else {
        console.error("Invalid latitude or longitude");
        // Optionally, set an error state to show a message to the user
      }
    }
  };

  const formatMessage = (message: string) => {
    // Split the message by newline for easier formatting
    const sections = message.split("\n");

    return (
      <Box>
        {sections.map((section, index) => (
          <Typography key={index} paragraph>
            {/* Bold the section if it ends with a question mark */}
            <span
              dangerouslySetInnerHTML={{ __html: formatSection(section) }}
            />
          </Typography>
        ))}
      </Box>
    );
  };

  const formatSection = (section: string) => {
    return section
      .replace(/(Have you tried any of the.*?)(?=\n|$)/g, "<strong>$1</strong>")
      .replace(
        /(Are you interested in visiting any of the parks in your area.*?)(?=\n|$)/g,
        "<strong>$1</strong>"
      )
      .replace(
        /(Would you like to join a sports club in your area.*?)(?=\n|$)/g,
        "<strong>$1</strong>"
      )
      .replace(
        /(Are you interested in joining a book club in your area.*?)(?=\n|$)/g,
        "<strong>$1</strong>"
      )
      .replace(/(Name :)/g, "<strong>$1</strong>") // Bold "Name:"
      .replace(
        /(Location Link :)(.*)/g,
        (match, p1, p2) =>
          `${p1} <a href="${p2.trim()}" target="_blank" rel="noopener noreferrer">${p2.trim()}</a>`
      );
    // Make links clickable
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mental Health Recommendations</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100px"
          >
            <CircularProgress />
          </Box>
        ) : message ? (
          formatMessage(message)
        ) : (
          <Box>
            <Typography variant="body1" paragraph>
              Could not fetch location. Please enter your location manually.
            </Typography>
            <TextField
              label="Latitude"
              value={manualLocation?.latitude || ""}
              onChange={(e) =>
                setManualLocation({
                  latitude: e.target.value,
                  longitude: manualLocation?.longitude || "",
                })
              }
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Longitude"
              value={manualLocation?.longitude || ""}
              onChange={(e) =>
                setManualLocation({
                  latitude: manualLocation?.latitude || "",
                  longitude: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                onClick={handleManualLocationSubmit}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { MentalHealthDialog };
