import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  const [loading, setLoading] = useState(true);

  // ✅ Component Mount Check
  useEffect(() => {
    console.log('SavedBooks component mounted');
  }, []);

  // ✅ Fetch User Data with Debugging Logs
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          console.log('No token found, not logged in');
          setLoading(false);
          return;
        }

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const user = await response.json();
        console.log('Fetched User Data:', user);
        setUserData(user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // ✅ Dummy Data for Testing
    /*
    setUserData({
      username: 'TestUser',
      email: 'test@example.com',
      password: '',
      savedBooks: [
        {
          bookId: 'dummy1',
          authors: ['Author A'],
          title: 'Test Book 1',
          description: 'This is a test description',
          image: '',
        },
      ],
    });
    */
  }, []);

  // ✅ Handle Book Deletion
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return;
    }

    try {
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const updatedUser = await response.json();
      console.log('Updated User Data After Deletion:', updatedUser);
      setUserData(updatedUser);
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Loading State Debug
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => (
            <Col md='4' key={book.bookId}>
              <Card border='dark'>
                {book.image && (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors?.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
