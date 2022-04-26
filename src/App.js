import "./App.css";
import { useState, useEffect } from "react";
import "./App.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { MdDelete } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
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
import {
  createTransit,
  deleteTransit,
  listenTransit,
  updateTransit,
  createFirebaseUser,
  userId,
  signInFirebaseUser,
} from "./firebase/firebase";

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

const AuthSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  password: Yup.string().min(5).required("Required"),
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
  const [user, setUser] = useState(null);

  const [listObj, setListObj] = useState({});
  const [selectedTransit, setSelectedTransit] = useState(null);

  const onSubmit = (v) => {
    if (selectedTransit) {
      updateTransit(selectedTransit, v?.title, v?.amount, v?.type);
      setSelectedTransit(null);
    } else {
      createTransit(v?.title, v?.amount, v?.type);
    }
    // setList([...list, v]);
    // This is local
    // let key = Math.random();
    // setListObj({
    //   ...listObj,
    //   [key]: v,
    // });
  };

  // const onDelete = (currentIndex) => {
  //   let filteredList = list.filter((el, index) => index !== currentIndex);
  //   setList(filteredList);
  // };

  const calculateCurrentBalance = () => {
    let total = 0;
    Object.keys(listObj).map((key) => {
      if (listObj[key]?.type === "Income") {
        total += listObj[key]?.amount;
      } else {
        total -= listObj[key]?.amount;
      }
    });
    return total;
  };

  const clcTotalIncome = () => {
    let total = 0;
    Object.keys(listObj).map((key) => {
      if (listObj[key]?.type === "Income") {
        total += listObj[key]?.amount;
      }
    });
    return total;
  };

  const clcTotalExpence = () => {
    let total = 0;
    Object.keys(listObj).map((key) => {
      if (listObj[key]?.type === "Expenses") {
        total += listObj[key]?.amount;
      }
    });
    return total;
  };

  // Firebase will listen data from database and set to database
  const listenerCallbackFn = (data) => {
    // console.log("transactions", data);
    // listen and update-> database -> ui
    setListObj(data);
  };

  useEffect(() => {
    let user = userId();
    // alert(JSON.stringify(user))
    setUser(userId());
    listenTransit(listenerCallbackFn);
  }, []);

  // Auth part

  const createdUser = (v) => {
    createFirebaseUser(v?.email, v?.password);
  };
  const singIn = () => {
    signInFirebaseUser();
  };
  return (
    <Container sx={{ width: "100%" }}>
      <Card>
        <p>Current User: {user?.currentUser?.email}</p>
      </Card>
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
        <Card sx={{ width: "26%", padding: "5px" }}>
          <h4>Total Expense: {clcTotalExpence()} $</h4>
        </Card>
      </Grid>
      <Grid container spacing={3}>
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
                        {transactionTypes.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <Button type="submit" variant="contained">
                      {selectedTransit ? "Edit" : "Add"}
                    </Button>
                  </Box>
                )}
              </Formik>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={createdUser}
                validationSchema={AuthSchema}
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
                    <h3> Auth Part</h3>
                    <div style={{ marginBottom: "20px" }}>
                      <TextField
                        error={errors.email && touched.email}
                        required
                        id="outlined-required"
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <TextField
                        error={errors.password && touched.password}
                        required
                        id="outlined-required"
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                    </div>
                    <Button type="submit" variant="contained">
                      Auth
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
                            <Button onClick={() => deleteTransit(key)}>
                              <MdDelete />
                            </Button>
                            <Button onClick={() => setSelectedTransit(key)}>
                              <FiEdit2 />
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
