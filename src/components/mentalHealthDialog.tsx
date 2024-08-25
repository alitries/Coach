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
  const [message, setMessage] = useState<string[] | null>(null);
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
      const messageData = await fetchRecreationalActivities(latitude, longitude);
      console.log("Fetched messageData:", messageData); // Debugging line
      setMessage(messageData);
    } catch (error) {
      console.error("Failed to fetch activities", error);
      setMessage(["Failed to fetch activities. Please try again later."]);
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

  const formatMessage = (messages: string[]) => {
    // Split the message by newline for easier formatting
    return (
      <Box>
        {messages.map((msg, index) => (
          <Typography key={index} paragraph>
            <span
              dangerouslySetInnerHTML={{ __html: msg }}
            />
          </Typography>
        ))}
      </Box>
    );
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
