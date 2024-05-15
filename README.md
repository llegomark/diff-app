# Diff App

Diff App is a web application that allows you to compare two pieces of text and highlight the differences between them. It provides a simple and intuitive interface for visualizing changes at the character, word, or line level.

## Features

- Compare text at the character, word, or line level
- Highlight added, removed, or modified text
- Display the total number of characters and words for each input box
- Responsive design for optimal viewing on different devices
- Engaging placeholder text that tells a story about how diff works

## Motivation

As a writer, I often find myself making changes to articles and documents. Keeping track of these changes can be challenging, especially when collaborating with others or revisiting a piece of writing after some time. I created Diff App to help me better track my changes and visually compare different versions of my articles. It has become an essential tool in my writing workflow, allowing me to easily identify and review modifications.

## Technologies Used

- HTML
- CSS (Tailwind CSS)
- JavaScript
- Vite (build tool)
- diff library (for comparing text)

## Getting Started

To run the Diff App locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/llegomark/diff-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd diff-app
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the Diff App in action.

## Usage

1. Enter the original text in the left input box.
2. Enter the modified text in the right input box.
3. Select the desired diff level (characters, words, or lines) using the radio buttons.
4. The differences between the two pieces of text will be highlighted in the result box.
5. The total number of characters and words for each input box will be displayed below the respective input box.

## Todo

### Accessibility
- [ ] Implement keyboard navigation support for radio buttons
- [ ] Ensure input boxes and diff result section are focusable and keyboard-accessible
- [ ] Add keyboard shortcuts for common actions (e.g., copying diff result, resetting input)
- [ ] Conduct thorough accessibility testing with screen readers and keyboard navigation
- [ ] Provide detailed instructions or a help section for using the app with assistive technologies

### Responsive Design
- [ ] Optimize layout for smaller screens (adjust font sizes, padding, margins)
- [ ] Use a responsive grid system or CSS flexbox for a more flexible layout

### Diff Customization
- [ ] Allow customization of diff highlighting colors for added, removed, and unchanged text
- [ ] Provide options to toggle line numbers or display a side-by-side diff view
- [ ] Add a settings panel or menu to control customization options

### File Upload and Download
- [ ] Implement file upload feature for comparing text files
- [ ] Add a "Download Diff" button to generate a downloadable file with the diff result

### Diff Statistics
- [ ] Display statistics about the diff (number of added, removed, and unchanged lines/words)
- [ ] Calculate and show the percentage of similarity between the input texts

### Undo/Redo Functionality
- [ ] Implement undo/redo feature for changes made to the input boxes
- [ ] Keep track of edit history and provide buttons or shortcuts to navigate undo/redo stack

### Syntax Highlighting
- [ ] Enhance diff result with syntax highlighting based on language or format of input text
- [ ] Integrate a syntax highlighting library or use a syntax highlighting service

### Performance Optimization
- [ ] Implement lazy loading for additional libraries or resources
- [ ] Optimize diff algorithm or explore alternative diff libraries for handling large input texts
- [ ] Minimize DOM manipulations and consider using virtual DOM techniques for faster rendering

### User Feedback and Error Handling
- [ ] Display user-friendly error messages or notifications for issues with input or diff processing
- [ ] Provide a feedback mechanism for users to report bugs, suggest improvements, or seek assistance

### Documentation
- [ ] Update README.md with detailed installation, usage, and configuration instructions
- [ ] Add contributing guidelines and code of conduct for potential contributors
- [ ] Include screenshots or GIFs showcasing the app's features and functionality

### Testing
- [ ] Implement unit tests for critical functions and components
- [ ] Write end-to-end tests to ensure the app works as expected
- [ ] Set up continuous integration and continuous deployment (CI/CD) pipelines

### Deployment
- [ ] Prepare the app for production deployment
- [ ] Configure necessary build tools and optimizations
- [ ] Set up hosting and deployment infrastructure
- [ ] Ensure the app is deployed securely and efficiently

### Maintenance
- [ ] Regularly update dependencies and libraries to their latest stable versions
- [ ] Monitor and address any reported bugs or issues
- [ ] Plan and implement future enhancements and features based on user feedback and requirements

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Make sure to follow the existing code style and conventions.

## License

This project is licensed under the [MIT License](LICENSE).