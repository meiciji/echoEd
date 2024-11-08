import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 

function Summary() {
  // Get the current location object, which contains information about the current URL
  const { state } = useLocation(); 
  // Initialize state variables
  const [value, setValue] = useState(state?.content || ""); // Set initial text from passed data or empty
  const [summary, setSummary] = useState(""); // State for the summary of the text
  const [submitting, setSubmitting] = useState(false); // State to track if we are currently submitting the form

  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default behavior of form submission (page refresh)
    setSubmitting(true); // Indicate that we are starting to submit the form
    generateSummary(value); // Call the function to generate a summary from the input text
  };

  // Function to generate a summary from the provided text
  const generateSummary = (text) => {
    if (!text) { // Check if the input text is empty
        setSummary("Please provide some text to summarize."); // Show an error message if no text is provided
        setSubmitting(false); // Reset submission status
        return; // Exit the function
    }

    // Split the text into sentences and create an object to count word frequencies
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || []; 
    const wordFrequency = {};

    // Loop through each word in the text
    text.split(/\W+/).forEach((word) => {
        const lowerWord = word.toLowerCase(); // Convert word to lowercase to avoid duplicates
        if (lowerWord.length > 3) { // Only count words that are longer than 3 letters
            // Update the word frequency count
            wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
        }
    });

    // Score each sentence based on the frequency of words it contains
    const significantSentences = sentences.map((sentence) => {
        const score = sentence.split(/\W+/).reduce((acc, word) => {
            const lowerWord = word.toLowerCase(); // Convert word to lowercase
            return acc + (wordFrequency[lowerWord] || 0); // Add the word's frequency to the score
        }, 0);
        return { sentence, score }; // Store the sentence along with its score
    });

    // Set a minimum score to filter out less important sentences
    const threshold = 1; 

    // Create a summary by selecting the most important sentences
    const bulletPointSummary = significantSentences
        .filter((item) => item.score > threshold) // Keep only sentences with a score above the threshold
        .sort((a, b) => b.score - a.score) // Sort sentences from highest to lowest score
        .slice(0, 3) // Take the top 3 sentences to make the summary concise
        .map((item) => `• ${item.sentence.trim()}`) // Format each sentence as a bullet point
        .join("\n"); // Join all bullet points into a single string

    // Update the summary state with the generated summary or a message if none was found
    setSummary(bulletPointSummary || "No significant content found."); 
    setSubmitting(false); // Reset the submission status
};

  return (
    <div className='w-full bg-white h-full min-h-[100vh] py-4 px-4 md:px-20'>
      <button
        className='text-black px-4 py-2 rounded-md mb-4'
        onClick={() => navigate('/dashboard')} // Navigate to the dashboard
    >
        &lt; Back
    </button>
      <div className='flex flex-col items-center justify-center mt-4 p-4'>
        <h1 className='text-3xl text-black text-center leading-10 font-semibold'>Lecture Summarizer</h1>
        <p className='mt-5 text-lg text-gray-500 sm:text-xl text-center max-w-2xl'>
          Paste your note content here to get a concise bullet point summary!
        </p>
      </div>

      <div className='flex flex-col w-full items-center justify-center mt-5'>
        <textarea
          placeholder='Paste document content here ...'
          rows={6}
          className='block w-full md:w-[650px] rounded-md border border-slate-700 bg-slate-800 p-2 text-sm shadow-lg font-medium text-white focus:border-gray-500 focus:outline-none focus:ring-0'
          onChange={(e) => setValue(e.target.value)} // Update the input value when the user types
          value={value} // Control the textarea's value
        ></textarea>

        {value.length > 0 && (submitting ? (
          <p className='text-md text-cyan-500 mt-5'>Please wait ....</p> // Show loading message while submitting
        ) : (
          <button
            className='mt-5 bg-blue-500 px-5 py-2 text-white text-md font-cursor-pointer rounded-md'
            onClick={handleSubmit} // Call handleSubmit when the button is clicked
          >
            Submit
          </button>
        ))}

        <h2 className='text-xl mt-5 text-black-200'>Summary:</h2>
        <div className='bg-gray-800 p-4 rounded-md mt-2 w-full md:w-[650px]'>
          <div className='text-gray-300 whitespace-pre-wrap font-normal text-base'>
            {summary.split('\n').map((line, index) => (
              <p key={index} className='my-1'>{line}</p> // Render each bullet point in a new paragraph
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Summary;
