// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  name: string;
  exp: number;
}

// Create a new class to instantiate for a user
class AuthService {
  /**
   * Retrieves user data from the stored token.
   * @returns {UserToken | null} Decoded token data or null if not found.
   */
  getProfile(): UserToken | null {
    const token = this.getToken();
    return token ? jwtDecode<UserToken>(token) : null;
  }

  /**
   * Checks if the user is logged in based on token validity.
   * @returns {boolean} True if the user is logged in.
   */
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Checks if the JWT token is expired.
   * @param {string} token - JWT token.
   * @returns {boolean} True if token is expired.
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<UserToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error("Invalid token:", err);
      return true;
    }
  }

  /**
   * Retrieves the JWT token from localStorage.
   * @returns {string | null} The token or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  /**
   * Saves a JWT token to localStorage and redirects the user.
   * @param {string} idToken - JWT token.
   */
  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  /**
   * Clears JWT token from localStorage and logs out the user.
   */
  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
