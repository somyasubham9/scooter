import "./scooter-tagore.scss";
import { useState, useEffect, useRef } from "react";
import './scooter-tagore.scss'
import { NodeViewWrapper,NodeViewContent } from "@tiptap/react";
import axios from 'axios'

export function TagoreFetcher({
  isVisible,
  setIsVisible,
  editor,
} ) {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = event => {
    setInputValue(event.target.value);
    // setShowCommands(true);
  };

  const JSONCommand = {
    "Brainstorm Ideas": "Brainstorm ideas on ",
    "Blog Post": "Write a blog post about ",
    "Outline": "Write an outline about ",
    "Social Media Post": "Write a social media post about ",
    "Creative Story": "Write a creative story about ",
    "Essay": "Write an essay about ",
    "To Do List": "Write a todo list about ",
    "Pros and Cons List": "Write a pros and cons list about ",
  };
  const commands = Object.keys(JSONCommand);
 
  useEffect(() => {
    // Call the AI API whenever the editor content changes
   
    async function fetchData() {
      try {
        const response = await axios.post("http://localhost:8080/prompts/generate",{input:inputValue});
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log("Couldn't fetch data");
      }
    }
    fetchData();
  }, [inputValue]);

  const writeAboutTopic = async topic => {
    // Use AI to generate text about the topic
    // This function would depend on the specific AI and data sources being used
    const text = await generateText(topic);
    return text;
  };

  const generateText = async topic => {
    // Use AI to generate text about the topic
    // This function would depend on the specific AI and data sources being used
    return "Lorem ipsum dolor sit amet..."; // Replace with actual text
  };

  const handleKeyDown = async event => {
    if (event.key === "Enter") {
      // Extract command and arguments from input value
      editor
      .chain()
      .focus()
      .setTagore({ data, caption: captionText })
      .run();
      setInputValue("");
      setIsVisible(false);
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
     isVisible &&
     <NodeViewWrapper>
   
    <pre className="container">
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
    </pre>
    
    </NodeViewWrapper>
  );
}

  // const [command, ...args] = inputValue.split(" ");
  // if (command === "Write") {
      //   // Use AI to write about a topic
      //   const result = await writeAboutTopic(args.join(" "));
      //   console.log(result);
      // } else {
      //   // Handle other commands
      //   console.log(`Unknown command: ${command}`);
      // }