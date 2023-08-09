import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { amber, blue, green, indigo } from "@mui/material/colors";
import data from "../data/data.json";
import final from "../data/final.json";

const TitleItem = styled(Paper)(({ theme }) => ({
  backgroundColor: blue[700],
  ...theme.typography.h4,
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#FFF",
  borderRadius: 0,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer"
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: blue[800],
  ...theme.typography.h4,
  padding: theme.spacing(1),
  textAlign: "center",
  color: amber[400],
  borderRadius: 0,
  border: "1px solid #444",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
export default function Board() {
  let copyData = JSON.parse(JSON.stringify(data));
  copyData.forEach((o, categoryIndex) => {
    let rindex = 0;
    o.questions?.forEach((q) => {
      q.id = `row_${rindex}_cell_${categoryIndex}`;
      rindex++;
      return q;
    });
    return o;
  });
  const currentData = copyData;
  //   console.log("current data? ", currentData);
  const [activeItem, setActiveItem] = useState(null);
  const [viewedItems, setViewedItems] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [open, setOpen] = React.useState(false);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [donePrompt, setDonePrompt] = React.useState(false);

  const isViewedItem = (id) => {
    //   console.log("viewed id? ", id);
    //   console.log("viewed Items ", viewedItems);
    return viewedItems.find((item) => item.id === id);
  };

  // TODO remove hard-coded number here
  const isDone = () => viewedItems.length === 20;

  const reset = () => {
    setActiveItem(null);
    setViewedItems([]);
    setShowAnswer(false);
    setDonePrompt(false);
  };

  const handleClickOpen = (o, category) => {
    if (!o || isViewedItem(o?.id)) return;
    // console.log("clicked item ", o)
    setOpen(true);
    setActiveItem(o);
    setCurrentCategory(category);
    setShowAnswer(false);
  };

  const handleClose = () => {
    setOpen(false);
    setShowAnswer(false);
    if (!viewedItems.find((item) => item.id === activeItem?.id)) {
      setViewedItems([...viewedItems, activeItem]);
    }
    //console.log("viewed item ", viewedItems.length)
    if (isDone()) setDonePrompt(true);
  };
  const renderTitleRow = () => (
    <>
      {currentData.map((o, index) => {
        return (
          <Grid item xs={3} key={`title_${index}`}>
            <TitleItem>{o.category}</TitleItem>
          </Grid>
        );
      })}
    </>
  );
  const renderQuestionRows = () => {
    const numCategories = currentData.length;
    const rows = [
      Array(numCategories).fill("$200"),
      Array(numCategories).fill("$400"),
      Array(numCategories).fill("$600"),
      Array(numCategories).fill("$800"),
      Array(numCategories).fill("$1000"),
    ];
    let count = 0;
    return rows.map((row, numCategories) => {
      const rIndex = numCategories;
      count = 0;
      return row.map((o) => {
        const cellKey = `row_${rIndex}_cell_${count++}`;
        const matchedItem = currentData.find((item) =>
          item.questions.find((q) => q.id === cellKey)
        );
        const matchedQuestion = matchedItem?.questions.find(
          (q) => q.id === cellKey
        );
        return (
          <Grid
            item
            xs={3}
            key={cellKey}
            onClick={() =>
              handleClickOpen(matchedQuestion, matchedItem.category)
            }
          >
            <Item
              sx={{
                backgroundColor: isViewedItem(matchedQuestion?.id)
                  ? indigo[900]
                  : blue[800],
                color: isViewedItem(matchedQuestion?.id)
                  ? amber[400]
                  : amber[300],
              }}
            >
              {o}
              {/* {cellKey} */}
            </Item>
          </Grid>
        );
      });
    });
  };
  const renderFinalJeopardy = () => {
    return (
      <Grid item xs={12} sx={{ borderTop: "2px solid" }}>
        <Item
          sx={{
            backgroundColor: isViewedItem(final?.id) ? blue[900] : blue[800],
            color: isViewedItem(final?.id) ? amber[400] : amber[300],
          }}
          onClick={() => handleClickOpen(final, "Final Jeopardy")}
        >
          Final Jeopardy
          {/* {cellKey} */}
        </Item>
      </Grid>
    );
  };
  const renderQuestionView = () => {
    const calcHeight = window.outerHeight - 232;
    const handleButtonClick = () => setShowAnswer(true);
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h5" component="div">
              {currentCategory}
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper sx={{ height: "100%", padding: (theme) => theme.spacing(2) }}>
          <Stack
            spacing={2}
            direction={"column"}
            alignItems={"center"}
            sx={{
              maxWidth: "100%",
              height: calcHeight,
              overflow: "auto",
            }}
          >
            {activeItem?.title && <Typography variant="h4">{activeItem.title}</Typography>}
            {activeItem &&
              activeItem.img &&
              activeItem.img.map((item, index) => (
                <Box key={`img_${index}`}>
                  <img src={item.src} alt=""></img>
                </Box>
              ))}
          </Stack>
          <Stack
            spacing={2}
            direction="row"
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ marginTop: (theme) => theme.spacing(1) }}
          >
            {!showAnswer && (
              <Box>
                <Button
                  variant="contained"
                  onClick={handleButtonClick}
                  size="large"
                >
                  Show Answer
                </Button>
              </Box>
            )}
            <Box sx={{ display: showAnswer ? "block" : "none" }}>
              <Typography variant="h5" color={green[900]}>
                {activeItem?.answer}
              </Typography>
            </Box>
            <Button variant="outlined" size="large" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </Paper>
      </Dialog>
    );
  };
  const renderDoneDialog = () => {
    const handleClose = () => setDonePrompt(false);

    return (
      <Dialog
        open={donePrompt}
        onClose={handleClose}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All questions have been viewed. Play again?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={reset} variant="contained">Yes</Button>
          <Button onClick={handleClose} autoFocus variant="outlined">
            No, Thanks
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  return (
    <Box sx={{ flexGrow: 1, height: "100%" }}>
      <Grid container sx={{ height: "100%" }}>
        {currentData && renderTitleRow()}
        {currentData && renderQuestionRows()}
        {currentData && renderQuestionView()}
        {final && renderFinalJeopardy()}
        {renderDoneDialog()}
      </Grid>
    </Box>
  );
}
