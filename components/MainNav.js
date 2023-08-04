import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { Navbar, Nav, Form, Button, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import Container from 'react-bootstrap/Container';
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { addToHistory, removeFromHistory } from "../lib/userData"; // Import the addToHistory and removeFromHistory functions
import { readToken, removeToken } from "/lib/authenticate"; // Import the readToken function

const MainNav = () => {
  const router = useRouter();
  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const token = readToken(); // Get the token value

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchField) {
      return;
    }

    const queryString = `title=true&q=${searchField}`;
    setSearchHistory(await addToHistory(queryString));

    router.push(`/artwork?${queryString}`);
    e.target.reset();
    setIsExpanded(false);
  };

  const handleNavDropdownItemClick = () => {
    setIsExpanded(false);
  };

  // Define the logout function
  const logout = () => {
    setIsExpanded(false); // Collapse the menu
    removeToken(); // Remove the token from localStorage
    router.push("/login"); // Redirect the user to the login page
  };

  return (
    <>
      <Container>
        <Navbar
          className="fixed-top navbar-dark bg-primary"
          expand="md"
          expanded={isExpanded}
        >
          <Navbar.Brand>Abdullah</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" onClick={handleToggle} />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mr-auto">
              <Link href="/" passHref>
                <Nav.Link
                  active={router.pathname === "/"}
                  onClick={() => {
                    setIsExpanded(false);
                    router.push("/");
                  }}
                >
                  Home
                </Nav.Link>
              </Link>
              {token && ( // Show the "Advanced Search" navigation item if the user is logged in
                <Link href="/search" passHref>
                  <Nav.Link
                    active={router.pathname === "/search"}
                    onClick={() => {
                      setIsExpanded(false);
                      router.push("/search");
                    }}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            &nbsp;
            {token && ( // Show the "Search" form if the user is logged in
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => {
                    setSearchField(e.target.value);
                  }}
                />
                <Button type="submit" variant="success">
                  Search
                </Button>
              </Form>
            )}
            &nbsp;
            <Nav as="ul" className="ml-auto" style={{ marginBottom: "10px" }}>
              {token ? ( // Show the "User Name" dropdown if the user is logged in
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <Link href="/history">
                    <NavDropdown.Item
                      onClick={() => {
                        setIsExpanded(false);
                        router.push("/history");
                      }}
                      active={router.pathname === "/history"}
                    >
                      History
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/favourites">
                    <NavDropdown.Item
                      onClick={() => {
                        setIsExpanded(false);
                        router.push("/favourites");
                      }}
                      active={router.pathname === "/favourites"}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item> {/* Add the Logout item */}
                </NavDropdown>
              ) : (
                // Show the Register and Login links if the user is not logged in
                <Nav className="me-auto">
                  <Link href="/register" passHref>
                    <Nav.Link
                      onClick={() => {
                        setIsExpanded(false);
                        router.push("/register");
                      }}
                      active={router.pathname === "/register"}
                    >
                      Register
                    </Nav.Link>
                  </Link>
                  <Link href="/login" passHref>
                    <Nav.Link
                      onClick={() => {
                        setIsExpanded(false);
                        router.push("/login");
                      }}
                      active={router.pathname === "/login"}
                    >
                      Login
                    </Nav.Link>
                  </Link>
                </Nav>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <br />
      <br />
    </>
  );
};

export default dynamic(() => Promise.resolve(MainNav), { ssr: false });
