import { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button, Alert } from 'react-bootstrap';
import { ADD_USER } from '../graphql/mutations';
import Auth from '../utils/auth';
import type { User } from '../models/User';

// Props for handling the closing of the signup modal
interface SignupFormProps {
  handleModalClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ handleModalClose }) => {
  // Form data state
  const [userFormData, setUserFormData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  // Form validation and alert state
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Apollo useMutation hook
  const [addUser, { error }] = useMutation(ADD_USER);

  // Handle input changes for form fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for signing up
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      if (!data || !data.addUser) {
        throw new Error('Signup failed. Please try again.');
      }

      // Automatically log in the user after successful signup
      Auth.login(data.addUser.token);
      handleModalClose(); // Close the signup modal
    } catch (err) {
      console.error('Signup Error:', err);
      setShowAlert(true); // Show error alert
    }

    // Reset form after submission
    setUserFormData({
      username: '',
      email: '',
      password: '',
      savedBooks: [],
    });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      {/* Alert message for failed signup attempts */}
      <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
        Something went wrong with your signup. Please try again!
      </Alert>

      {/* Username Input */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your username"
          name="username"
          onChange={handleInputChange}
          value={userFormData.username}
          required
        />
      </Form.Group>

      {/* Email Input */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Your email address"
          name="email"
          onChange={handleInputChange}
          value={userFormData.email}
          required
        />
      </Form.Group>

      {/* Password Input */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your password"
          name="password"
          onChange={handleInputChange}
          value={userFormData.password}
          required
        />
      </Form.Group>

      {/* Submit Button */}
      <Button
        disabled={!(userFormData.username && userFormData.email && userFormData.password)}
        type="submit"
        variant="success"
      >
        Submit
      </Button>
    </Form>
  );
};

export default SignupForm;
