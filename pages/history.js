import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import ListGroup from "react-bootstrap/ListGroup";
import { NavDropdown, Card, Button } from "react-bootstrap";
import { removeFromHistory } from "/lib/userData"; // Import the removeFromHistory function

import styles from '@/styles/History.module.css'

export default function AdvancedSearch() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  if (!searchHistory) return null;

  let parsedHistory = [];

  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  const historyClicked = (e, index) => {
    e.stopPropagation(); //or e.preventDefault();
    const queryString = searchHistory[index];
    router.push(`/artwork?${queryString}`);
  };

  // Modify the function to be asynchronous
  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation(); //or e.preventDefault();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  };

  return (
    <>
      <NavDropdown title="Search History" id="basic-nav-dropdown">
        {parsedHistory.length === 0 ? (
          <NavDropdown.Item>
            <Card>
              <Card.Body>
                <Card.Text>Nothing Here Try searching for some artwork</Card.Text>
              </Card.Body>
            </Card>
          </NavDropdown.Item>
        ) : (
          <ListGroup>
            {parsedHistory.map((historyItem, index) => (
              <ListGroup.Item className={styles.historyListItem} key={index} onClick={(e) => historyClicked(e, index)}>
                {Object.keys(historyItem).map((key) => (
                  <span key={key}>
                    {key}: <strong>{historyItem[key]}</strong>&nbsp;
                  </span>
                ))}
                <Button
                  className="float-end"
                  variant="danger"
                  size="sm"
                  onClick={(e) => removeHistoryClicked(e, index)}
                >
                  &times;
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </NavDropdown>
    </>
  );
}
