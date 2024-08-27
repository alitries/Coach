import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface OptionsDialogProps {
  open: boolean;
  onClose: () => void;
}

 const typography = {
  heading: {
    fontSize: '1.5rem',
    fontWeight: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    padding: '0.3rem',
    borderRadius: '0.2rem', 
  },
  body: {
    fontSize: '1rem',
    color: '#272D2D',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    padding: '0.2rem', 
    borderRadius: '0.2rem', 
  },
};

 const colors = {
  cardTextColor: 'black',
  cardBackgroundSize: 'cover', // Ensures the image covers the card
  cardBackgroundPosition: 'center',
  cardBackgroundRepeat: 'no-repeat',
  cardHeight: '20rem',
  backgroundColor: 'black', // Semi-transparent background color
};

const OptionsDialog: React.FC<OptionsDialogProps> = ({ open, onClose }) => {
  const handleCardClick = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sports</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Link to="/cricket-coach" onClick={handleCardClick}>
              <Card
                sx={{
                  backgroundImage: "url(../images/cricket.webp)",
                  backgroundSize: colors.cardBackgroundSize,
                  backgroundPosition: colors.cardBackgroundPosition,
                  backgroundRepeat: colors.cardBackgroundRepeat,
                  color: colors.cardTextColor,
                  height: colors.cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" sx={typography.heading}>
                    Cricket Coach
                  </Typography>
                  <Typography variant="body2" sx={typography.body}>
                    Talk all about Cricket to the Cricket Coach here.
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link to="/javelin-coach" onClick={handleCardClick}>
              <Card
                sx={{
                  backgroundImage: "url(../images/javelin.webp)",
                  backgroundSize: colors.cardBackgroundSize,
                  backgroundPosition: colors.cardBackgroundPosition,
                  backgroundRepeat: colors.cardBackgroundRepeat,
                  color: colors.cardTextColor,
                  height: colors.cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" sx={typography.heading}>
                    Javelin Coach
                  </Typography>
                  <Typography variant="body2" sx={typography.body}>
                    Talk all about Javelin to the Javelin Coach here.
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link to="/football-coach" onClick={handleCardClick}>
              <Card
                sx={{
                  backgroundImage: "url(../images/football.webp)",
                  backgroundSize: colors.cardBackgroundSize,
                  backgroundPosition: colors.cardBackgroundPosition,
                  backgroundRepeat: colors.cardBackgroundRepeat,
                  color: colors.cardTextColor,
                  height: colors.cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" sx={typography.heading}>
                    FootBall Coach
                  </Typography>
                  <Typography variant="body2" sx={typography.body}>
                    Talk all about Football to the Football Coach here.
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link to="/volleyball-coach" onClick={handleCardClick}>
              <Card
                sx={{
                  backgroundImage: "url(../images/volleyball.webp)",
                  backgroundSize: colors.cardBackgroundSize,
                  backgroundPosition: colors.cardBackgroundPosition,
                  backgroundRepeat: colors.cardBackgroundRepeat,
                  color: colors.cardTextColor,
                  height: colors.cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" sx={typography.heading}>
                    VolleyBall Coach
                  </Typography>
                  <Typography variant="body2" sx={typography.body}>
                    Talk all about Volleyball to the Volleyball Coach here.
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export { OptionsDialog };

