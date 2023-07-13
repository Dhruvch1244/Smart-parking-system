import React from "react";
import {
  Box,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  useTheme,
  Button,
} from "@mui/material";
import { Header, CustomColumnMenu } from "components";
import VideoJS from "./videoJS";
import { DataGrid } from "@mui/x-data-grid";
import { useGetCCTVQuery } from "state/api";

// CCTV
const CCTV = () => {
  // Dummy data for CCTV cameras
  const data = [
    { id: "cctv1", name: "Camera 1" },
    { id: "cctv2", name: "Camera 2" },
    { id: "cctv3", name: "Camera 3" },
    { id: "cctv1", name: "Camera 1" },
  ];

  // is medium/large desktop
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const { data_, isLoading } = useGetCCTVQuery();

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      {/* Header */}
      <Header title="CCTV" subtitle="Live and Recorded CCTV footages" />

      {/* Content */}
      <Box display="flex">
        {/* Video Player */}
        <Box flex="1" mr={2}>
          <VideoJS />
        </Box>

        {/* CCTV Camera List */}
        <Box flex="1">
          <CardWrapper>
            <CardContent>
              <Typography variant="h6" component="div" mb={2}>
                CCTV Cameras
              </Typography>
              {data && data.length > 0 ? (
                <List>
                  {data.map((cctv) => (
                    <ListItem key={cctv.id}>
                      <Button
                        component="a"
                        href="#"
                        variant="text"
                        fullWidth
                      >
                        {`CCTV ${cctv.name}`}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No CCTV cameras found.
                </Typography>
              )}
            </CardContent>
          </CardWrapper>
        </Box>
      </Box>
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButtom-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        {/* Grid Table */}
        <DataGrid
          loading={isLoading || !data_}
          getRowId={(row) => row._id}
          rows={data_ || []}
          columns={columns}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

const CardWrapper = ({ children }) => (
  <Box
    sx={{
      height: "100%",
      overflow: "auto",
      maxHeight: "500px", // Set the desired max height
      backgroundColor: "#21262e", // Set the desired background color
      borderRadius: "0.55rem",
    }}
  >
    {children}
  </Box>
);

export default CCTV;