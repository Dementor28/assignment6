import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { Navbar, Nav, Form, Button, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { addToHistory, removeFromHistory } from "../lib/userData";
import { readToken, removeToken } from "/lib/authenticate";

function MainNav() {
  const router = useRouter();

  const [route, setRoute] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsExpanded(false);
    router.push(`/artwork?title=true&q=${route}`);
    setSearchHistory(await addToHistory(`title=true&q=${route}`));
    e.target.reset();
  };

  let token = readToken();

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  }

  return (
    <>
      <Navbar
        className="fixed-top"
        bg="light"
        expand="lg"
        expanded={isExpanded}
      >
        <Container>
          {token ? (
            <Navbar.Brand>{token.userName}</Navbar.Brand>
          ) : (
            <Navbar.Brand>Museum of Art</Navbar.Brand>
          )}

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={(e) => {
              setIsExpanded(!isExpanded);
            }}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref>
                <Nav.Link
                  onClick={(e) => {
                    setIsExpanded(false);
                    router.push("/");
                  }}
                  active={router.pathname === "/"}
                >
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref>
                  <Nav.Link
                    onClick={(e) => {
                      setIsExpanded(false);
                      router.push("/search");
                    }}
                    active={router.pathname === "/search"}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            &nbsp;
            {token && (
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => {
                    setRoute(e.target.value);
                  }}
                />
                <Button type="submit" variant="success">
                  Search
                </Button>
              </Form>
            )}
            &nbsp;
            {token ? (
              <Nav>
                <NavDropdown
                  title={token.userName}
                  id="basic-nav-dropdown"
                  active={
                    router.pathname === "/favourites" ||
                    router.pathname === "/history"
                  }
                >
                  <Link href="/favourites" passHref>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsExpanded(false);
                        router.push("/favourites");
                      }}
                      active={router.pathname === "/favourites"}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsExpanded(false);
                        router.push("/history");
                      }}
                      active={router.pathname === "/history"}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Link href="/register" passHref>
                  <Nav.Link
                    onClick={(e) => {
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
                    onClick={(e) => {
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}

export default dynamic(() => Promise.resolve(MainNav), { ssr: false });
