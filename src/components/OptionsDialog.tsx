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
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Cricket
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Talk all about Cricket here.
                </Typography>
              </CardContent>
              <CardActions>
                <Link to="/cricket">
                <Button size="small">Learn More</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Option 2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description for option 2.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsDialog;
