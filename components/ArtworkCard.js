import { Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import Error from 'next/error';

function ArtworkCard({ objectID }) {
  const router = useRouter();

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const { primaryImageSmall, title, objectDate, classification, medium } = data;

  const handleButtonClick = () => {
    router.push(`/artwork/${objectID}`);
  };

  return (
    <Card>
      <Card.Img
        src={primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'}
      />
      <Card.Body>
        <Card.Title>{title || 'N/A'}</Card.Title>
        <Card.Text>
          Object Date: {objectDate || 'N/A'}
          <br />
          Classification: {classification || 'N/A'}
          <br />
          Medium: {medium || 'N/A'}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref>
          <Button onClick={handleButtonClick}>{objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default ArtworkCard;
