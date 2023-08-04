import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { searchHistoryAtom } from '@/store';
import { useAtom } from "jotai";
import { addToHistory } from "/lib/userData"; // Import the addToHistory function

export default function AdvancedSearch() {
  const router = useRouter();

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Modify the function to be asynchronous
  const submitForm = async (data) => {
    let queryString = `searchBy=true`;

    if (data.geoLocation) {
      queryString += `&geoLocation=${data.geoLocation}`;
    }
    if (data.medium) {
      queryString += `&medium=${data.medium}`;
    }
    queryString += `&isOnView=${data.isOnView}&isHighlight=${data.isHighlight}&q=${data.q}`;

    router.push(`/artwork?${queryString}`);

    // Use the addToHistory function to update the search history
    setSearchHistory(await addToHistory(queryString));
  };

  return (
    <>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Search Query</Form.Label>
              <Form.Control
                className={errors.q?.type === "required" && "is-invalid"}
                type="text"
                placeholder=""
                name="q"
                {...register("q", { required: true })}
              />
            </Form.Group>
          </Col>
          </Row>
          <Row>
          <Col md={4}>
            <Form.Label>Search By</Form.Label>
            <Form.Select name="searchBy" className="mb-3"  {...register("searchBy")}>
              <option value="title">Title</option>
              <option value="tags">Tags</option>
              <option value="artistOrCulture">Artist or Culture</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Geo Location</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="geoLocation"
                {...register("geoLocation")}
              />
            <Form.Text className="text-muted">
              Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
            </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Medium</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="medium"
                {...register("medium")}
              />
            <Form.Text className="text-muted">
              Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
            </Form.Text>
            </Form.Group>
          </Col>
          </Row>
        <Row>
          <Col>
            <Form.Check
              type="checkbox"
              label="Highlighted"
              name="isHighlight"
              {...register("isHighlight")}
            />
            <Form.Check
              type="checkbox"
              label="Currently on View"
              name="isOnView"
              {...register("isOnView")}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
