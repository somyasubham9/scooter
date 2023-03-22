import "./scooter-tagore.scss";
import { useState, useEffect, useRef } from "react";
export function ScooterTagore({ onCommand }) {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const inputRef = useRef(null);
  const handleInputChange = event => {
    setInputValue(event.target.value);
    // setShowCommands(true);
  };
  const JSONCommand = {
    "Brainstorm Ideas": "Brainstorm ideas on ",
    "Blog Post": "Write a blog post about ",
    Outline: "Write an outline about ",
    "Social Media Post": "Write a social media post about ",
    "Creative Story": "Write a creative story about ",
    Essay: "Write an essay about ",
    "To Do List": "Write a todo list about ",
    "Pros and Cons List": "Write a pros and cons list about ",
  };
  const commands = Object.keys(JSONCommand);
  // useEffect(() => {
  //   // Call the AI API whenever the editor content changes
  //   async function fetchData() {
  //     const response = await fetch("https://api");
  //     const jsonData = await response.json();
  //     setData(jsonData);
  //   }
  //   fetchData();
  // }, [inputValue]);

  const writeAboutTopic = async topic => {
    // Use AI to generate text about the topic
    // This function would depend on the specific AI and data sources being used
    const text = await generateText(topic);
    return text;
    // Use Notion API to create a new page with the text
    // const pageId = await createPage(topic, text);
    // return `Wrote about ${topic} on page ${pageId}`;
  };

  const generateText = async topic => {
    // Use AI to generate text about the topic
    // This function would depend on the specific AI and data sources being used
    return "Lorem ipsum dolor sit amet..."; // Replace with actual text
  };

  const handleKeyDown = async event => {
    if (event.key === "Enter") {
      // Extract command and arguments from input value
      const [command, ...args] = inputValue.split(" ");

      if (command === "Write") {
        // Use AI to write about a topic
        const result = await writeAboutTopic(args.join(" "));
        console.log(result);
      } else {
        // Handle other commands
        console.log(`Unknown command: ${command}`);
      }
      setInputValue("");
    }
  };

  const handleClick = () => {
    setShowCommands(true);
  };
  const handleCommandClick = command => {
    setInputValue(JSONCommand[`${command}`]);
    setShowCommands(false);
    inputRef.current.focus();
  };

  document.addEventListener("click", event => {
    // Check if the click was outside the input element
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // Hide the slash command option
      setShowCommands(false);
    }
  });

  return (
    <div className="container">
      <input
        className="input"
        type="text"
        value={inputValue}
        placeholder="Ask AI to write anything..."
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        ref={inputRef}
      />
      {showCommands && (
        <ul>
          {commands
            .filter(c => c.startsWith(inputValue))
            .map(c => (
              <li key={c} onClick={() => handleCommandClick(c)}>
                {c}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
export default ScooterTagore;

// const Obcommands = [
//   {"Brainstorm Ideas":"Brainstorm ideas on "},
//   {"Blog Post":"Write a blog post about "},
//   {"Outline":"Write an outline about "},
//  { "Social Media Post":"Write a social media post about "},
//   {"Creative Story":"Write a creative story about "},
//   {"Essay":"Write an essay about "},
//   {"To Do List":"Write a todo list about "},
//   {"Pros and Cons List":"Write a pros and cons list about "},
// ];
// import { Editor } from '@tiptap/react';
// import { useState, useEffect } from 'react';

// function TiptapEditor() {
//   const [editorContent, setEditorContent] = useState('');
//   const [aiSuggestions, setAiSuggestions] = useState([]);

//   useEffect(() => {
//     // Call the AI API whenever the editor content changes
//     fetch('/ai-api', {
//       method: 'POST',
//       body: JSON.stringify({ content: editorContent }),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     .then(response => response.json())
//     .then(data => setAiSuggestions(data.suggestions))
//     .catch(error => console.error(error));
//   }, [editorContent]);

//   const aiButton = {
//     // Define a custom Tiptap button that triggers the AI analysis
//     name: 'ai-button',
//     icon: 'search',
//     tooltip: 'Get AI suggestions',
//     run: () => {
//       // Call the AI API and display the results
//       fetch('/ai-api', {
//         method: 'POST',
//         body: JSON.stringify({ content: editorContent }),
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       .then(response => response.json())
//       .then(data => setAiSuggestions(data.suggestions))
//       .catch(error => console.error(error));
//     }
//   };

//   return (
//     <div>
//       <Editor
//         content={editorContent}
//         onUpdate={(content) => setEditorContent(content)}
//         extensions={[aiButton]}
//       />
//       {aiSuggestions.length > 0 && (
//         <div className="ai-suggestions">
//           <ul>
//             {aiSuggestions.map((suggestion, index) => (
//               <li key={index}>{suggestion}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
// const createPage = async (title, text) => {
//   // Use Notion API to create a new page with the text
//   // This function would depend on the specific Notion API being used
//   return 'abc123'; // Replace with actual page ID
// };
