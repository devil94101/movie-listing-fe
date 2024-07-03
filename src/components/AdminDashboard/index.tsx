import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MovieDetailType } from "../../types/movieTypes";
import { AxiosInstance } from "../../utils/networkWrapper";
import Loader from "../../common/loader/loader";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import ResponsiveDialog from "../../common/Modal/modal";
import { TablePagination } from "@mui/material";
import Toastr, {showToast} from '../../common/toastr/toastr'

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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Dashboard() {
  const [data, setData] = useState<MovieDetailType[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<MovieDetailType | null>(null);
  const [curPage, setCurPage] = useState(0)
  const [rowsPerPage, setrowsPerPage] = useState(10);

  const getMovieData = () => {
    setIsLoading(true);
    AxiosInstance.get("/movie-get")
      .then((res) => {
        console.log(res.data);
        const testDAta = [];
        for (let i = 0; i < 100; i++) {
          testDAta.push({
            ...res.data[0],
            id: i + "dfa" + res.data[0],
          });
        }
        setData(res.data);
      })
      .catch((err) => {
        showToast.error(err?.response?.data?.message || "Something went wrong while fetching the data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getMovieData();
  }, []);

  const deleteMovie = () => {
    if(!deleteId){
      return
    }
    setIsLoading(true)
    AxiosInstance.delete('/movie/'+deleteId?.id).then(()=>{
      const newData = [...data].filter(ele=>ele.id !== deleteId.id)
      setData(newData)
      setDeleteId(null);
      showToast.success("Movie Deleted Successfully!");
    }).catch(err=>{
      console.log(err)
      showToast.error(err?.response?.data?.message || "Something went wrong while deleting the data");
    }).finally(() =>{
      setIsLoading(false);
    })

  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setrowsPerPage(+event.target.value);
    setCurPage(0);
  };

  return (
    <div className="px-8 py-4">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }} >
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Gener</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(curPage * rowsPerPage, curPage * rowsPerPage + rowsPerPage).map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.title}
                  </StyledTableCell>
                  <StyledTableCell>{row.gener}</StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>
                  <StyledTableCell>
                    <div className="flex gap-x-4 items-center">
                      <Link to={"/movieDetail/" + row.id}>
                        <FaExternalLinkAlt />
                      </Link>
                      <MdDelete
                        onClick={() => setDeleteId(row)}
                        className=" cursor-pointer"
                        size={20}
                      />
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={curPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Paper>
      {loading && <Loader />}
      {deleteId && (
        <ResponsiveDialog
          open={true}
          setOpen={() => {
            setDeleteId(null);
          }}
          onAgree={() => deleteMovie()}
        >
          <div>
            Are u Sure you want to delete{" "}
            <span className=" font-bold italic">{deleteId.title}</span> movie{" "}
          </div>
        </ResponsiveDialog>
      )}
      <Toastr />
    </div>
  );
}
