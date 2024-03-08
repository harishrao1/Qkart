import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory, Link } from 'react-router-dom';
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {

  const history = useHistory()
  // const isLoggedIn = localStorage.getItem("token");


  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('balance');
    history.push("/");

    window.location.reload();
  }

  if(hasHiddenAuthButtons){
    return (
      <Box className="header">
        <Box className="header-title">
          <Link to="/">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Link>
        </Box>
        {children}
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
        Back to explore
        </Button>
      </Box>
    );
  }

  return (
      <Box className="header">
        <Box className="header-title">
          <Link to="/">
            <img src="logo_light.svg" alt="QKart-icon"></img>
            </Link>
        </Box>
        {children}
        <Stack direction="row" spacing={1} alignItems="center">
          {localStorage.getItem("username")? (
          <>
          <Avatar src="avatar.png" alt={localStorage.getItem("username") || "profile"}
          />
            <p className="username-text">{localStorage.getItem("username")}</p>
            <Button type="primary" onClick={logout}>
              Logout
            </Button>
          </>
          ):(
            <>
            <Button onClick={() => history.push("/login")}>Login</Button>
            <Button variant="contained" onClick={() => history.push("/register")}>
              Register
              </Button>
              </>
        )}
        </Stack>
      </Box>
    );
  };
      
//         {!hasHiddenAuthButtons && (
//         <Box className="header-buttons">
//           <Button className="explore-button" onClick={() => history.push("/login")}>
//             Login
//           </Button>
//           <Button className="button" variant="contained" color="primary" onClick={() => history.push("/register")}>
//             Register
//           </Button>
//         </Box>
//       )}
//       {hasHiddenAuthButtons && (
//         <Button
//           className="explore-button"
//           startIcon={<ArrowBackIcon />}
//           variant="text"
//           onClick={() => history.push("/")}
//         >
//         Back to explore
//         </Button>
//       )}
//       {isLoggedIn && (
//         <Button className="logout-button" onClick={handleLogoutClick}>
//           {/* <img src="avatar.png" alt="User avatar">Text</img> */}
//           {user && <span className="username">{user}</span>}
//           Logout
//         </Button>
//       )}
//        </Box> 
//     );
// };

export default Header;
