import { Row, Col, Pagination, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import { useState, useEffect } from 'react';
import ArtworkCard from '../../components/ArtworkCard';

import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE = 12;

export default function Artwork() {
  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];

  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);

  const { data, error } = useSWR(
    finalQuery ? `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}` : null
  );

  
  useEffect(() => {
    if (data) {
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
    }
    setPage(1);
  }, [data]);

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page < artworkList.length) {
      setPage(page + 1);
    }
  };

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!artworkList) {
    return null;
  }

  return (
    <>
      {artworkList.length > 0 && (
        <Row className="gy-4">
          {artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))}
        </Row>
      )}

      {artworkList.length === 0 && (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for something else.
          </Card.Body>
        </Card>
      )}

      {artworkList.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}
