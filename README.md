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

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Make sure to follow the existing code style and conventions.

## License

This project is licensed under the [MIT License](LICENSE).