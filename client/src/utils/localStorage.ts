/**
 * Retrieves saved book IDs from localStorage.
 * @returns {string[]} An array of saved book IDs.
 */
export const getSavedBookIds = (): string[] => {
  try {
    const savedBookIds = localStorage.getItem('saved_books');
    return savedBookIds ? JSON.parse(savedBookIds) : [];
  } catch (error) {
    console.error("Failed to parse saved books from localStorage:", error);
    return [];
  }
};

/**
 * Saves an array of book IDs to localStorage.
 * @param {string[]} bookIdArr - Array of book IDs to save.
 */
export const saveBookIds = (bookIdArr: string[]): void => {
  try {
    if (bookIdArr.length) {
      localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
    } else {
      localStorage.removeItem('saved_books');
    }
  } catch (error) {
    console.error("Failed to save book IDs to localStorage:", error);
  }
};

/**
 * Removes a book ID from the saved books in localStorage.
 * @param {string} bookId - The ID of the book to remove.
 * @returns {boolean} True if the book ID was removed successfully.
 */
export const removeBookId = (bookId: string): boolean => {
  try {
    const savedBookIds = getSavedBookIds();

    if (!savedBookIds.length) {
      return false;
    }

    const updatedSavedBookIds = savedBookIds.filter((savedBookId) => savedBookId !== bookId);
    localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

    return true;
  } catch (error) {
    console.error("Failed to remove book ID from localStorage:", error);
    return false;
  }
};
