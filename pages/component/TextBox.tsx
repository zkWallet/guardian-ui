import { Box, TextField } from "@mui/material";
import React from "react";

export interface CustomTextBoxProp {
  value: string;
}

const TextBox = (prop: CustomTextBoxProp) => {
  return (
    <Box>
      <TextField
        id="multiline"
        multiline
        rows={10}
        disabled
        defaultValue={prop.value}
        sx={{
          width: 500,
          height: 300,
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "white",
          },
          "& .MuiOutlinedInput-root.Mui-disabled": {
            "& fieldset": {
              borderWidth: "10px",
              borderColor: "red",
            },
            "&:hover fieldset": {
              borderColor: "yellow",
            },
          },
        }}
      />
    </Box>
  );
};

export default TextBox;