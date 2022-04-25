import "./App.css";
import { useState } from "react";
import "./App.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled } from '@mui/material/styles';
import {MdDelete} from 'react-icons/md';
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
  Card,
  CardContent,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell, tableCellClasses
} from "@mui/material";

const transactionTypes = [
  {
    label: "Income",
    value: "Income",
  },
  {
    label: "Expenses",
    value: "Expenses",
  },
];

const TransactionSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  amount: Yup.number().min(0).required("Required"),
  type: Yup.string().required("Required"),
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function App() {
  const [list, setList] = useState([]);

  const onSubmit = (v) => {
    setList([...list, v]);
  };

  const onDelete = currentIndex => {
    let filteredList = list.filter((el, index) => index!==currentIndex)
    setList(filteredList)
  }
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item>
          <Card>
            <CardContent>
              <Formik
                initialValues={{ title: "", amount: "", type: "Income" }}
                onSubmit={onSubmit}
                validationSchema={TransactionSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  <Box
                    onSubmit={handleSubmit}
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "40ch" },
                    }}
                  >
                    <h3> Add Transaction</h3>
                    <div style={{marginBottom:"20px"}}>
                      <TextField
                        error={errors.title && touched.title}
                        required
                        id="outlined-required"
                        label="Title"
                        type="text"
                        name="title"
                        placeholder="Title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                      />
                    </div>
                    <div style={{marginBottom:"20px"}}>
                      <TextField
                        error={errors.amount && touched.amount}
                        required
                        id="outlined-required"
                        label="Amount"
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.amount}
                      />
                    </div>
                    <div>
                      <TextField
                        error={errors.type && touched.type}
                        id="outlined-select-currency"
                        select
                        name="type"
                        label="Type"
                        value={values.type}
                        onChange={handleChange}
                        helperText="Please select your currency"
                      >
                        {transactionTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <Button type="submit" variant="contained">
                      Add
                    </Button>
                  </Box>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Box>
                <h3>History</h3>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 500 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Title</StyledTableCell>
                        <StyledTableCell align="center">Amount</StyledTableCell>
                        <StyledTableCell align="center">Type</StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((el, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {el.title}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {el.amount}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {el.type}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button onClick={() => onDelete(index)}><MdDelete/></Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
