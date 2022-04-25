import "./App.css";
import { useState, useEffect } from "react";
import "./App.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { MdDelete } from "react-icons/md";
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
  TableCell,
  tableCellClasses,
} from "@mui/material";
import { createTransaction } from "./firebase/firebase";
import { listenTransactions } from "./firebase/firebase";

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
  const [listObj, setListObj] = useState({});

  const onSubmit = (v) => {
    setList([...list, v]);
    //This is local
    // let key = Math.random();
    // setListObj({
    //   ...listObj,
    //   [key]: v,
    // });
    createTransaction(v?.title, v?.amount, v?.type);
  };

  const onDelete = (currentIndex) => {
    let filteredList = list.filter((el, index) => index !== currentIndex);
    setList(filteredList);
  };

  const calculateCurrentBalance = () => {
    let total = 0;
    list.map((el) => {
      if (el?.type === "Income") {
        total += el?.amount;
      } else {
        total -= el?.amount;
      }
    });
    return total;
  };

  const clcTotalIncome = () => {
    let total = 0;
    list?.map((el) => {
      if (el?.type === "Income") {
        total += el?.amount;
      }
    });
    return total;
  };

  const clcTotalExpence = () => {
    let total = 0;
    list?.map((el) => {
      if (el?.type === "Expenses") {
        total += el?.amount;
      }
    });
    return total;
  };

  // Firebase will read data from database
  const listenerCallbackFn = data => {
    console.log("transactions", data);
    //listen and update-> database -> ui
    setListObj(data)
  };
  useEffect(() => {
    listenTransactions(listenerCallbackFn);
  }, []);

  return (
    <Container sx={{ width: "100%" }}>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: "space-between", margin: "6px", width: "100%" }}
      >
        <Card sx={{ width: "26%", padding: "5px" }}>
          <h4>Current Balance: {calculateCurrentBalance()} $</h4>
        </Card>
        <Card sx={{ width: "26%", padding: "5px" }}>
          <h4>Total Income: {clcTotalIncome()} $</h4>
        </Card>
        <Card sx={{ width: "26%", padding: "5px" }} a>
          <h4>Total Expense: {clcTotalExpence()} $</h4>
        </Card>
      </Grid>
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
                    <div style={{ marginBottom: "20px" }}>
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
                    <div style={{ marginBottom: "20px" }}>
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
                      {Object.keys(listObj).map((key) => (
                        <StyledTableRow key={key}>
                          <StyledTableCell align="center">
                            {listObj[key].title}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {listObj[key].amount}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {listObj[key].type}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button onClick={() => onDelete()}>
                              <MdDelete />
                            </Button>
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
