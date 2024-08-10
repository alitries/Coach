import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface OptionsDialogProps {
  open: boolean;
  onClose: () => void;
}

const OptionsDialog: React.FC<OptionsDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sports</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundImage: "url(../images/javelin.webp)",
                backgroundSize: "50%", // Zoom out the image
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat", // Ensure the image does not repeat
                color: "white", // Adjust text color for better visibility
                height: "20rem", // Set the height of the card
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  Javelin Coach
                </Typography>
                <Typography variant="body2" color="white">
                  Talk all about Javelin to the Javelin Coach here.
                </Typography>
              </CardContent>
              <CardActions>
                <Link to="/javelin-coach">
                  <Button size="small" sx={{ color: "white" }}>Learn More</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsDialog;
