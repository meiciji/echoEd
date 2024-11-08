import React from 'react';
import { useEffect, useRef, useState } from "react";

/*
Next, I want to highlight the speech transcription feature, which utilizes the Web Speech API.
*/

// Declare a global interface to extend the Window object for webkitSpeechRecognition
declare global {
    interface Window {
        webkitSpeechRecognition: any; // Type for webkitSpeechRecognition
    }
}

// Define props for the RecordingView component
interface RecordingViewProps {
    onTranscriptChange: (transcript: string) => void; // Function to pass the transcript back to the parent
}

// Main RecordingView functional component
export default function RecordingView({ onTranscriptChange }: RecordingViewProps) {

    //Here, it's managing recording state with 'useState' and uses 'useRef' to hold the speech recognition instance.
    // State to track recording status and transcript
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>("");

    // Ref to hold the speech recognition instance
    const recognitionRef = useRef<any>(null);
    
    // Function to start recording
    const startRecording = () => {
        setIsRecording(true); // Set recording state to true

        // Initialize the speech recognition instance, allowing continuous and interim results
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true; // Keep recognizing until stopped
        recognitionRef.current.interimResults = true; // Provide interim results

        // Event handler for when results are returned
        //Captures the spoken input and updates the transcript while notifying the parent component through 'onTranscriptChange'
        recognitionRef.current.onresult = (event: any) => {
            let newTranscript = ''; // Variable to store the new transcript

            // Loop through the results from the event
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    newTranscript += result[0].transcript; // Append final results
                } else {
                    newTranscript += result[0].transcript; // Append interim results
                }
            }

            setTranscript(newTranscript.trim()); // Update transcript state
            onTranscriptChange(newTranscript.trim()); // Pass transcript to parent
        };        

        // Start the speech recognition
        recognitionRef.current.start();
    };
    
    // Handles cleanup by stopping recognition on component unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop(); // Stop recognition if running
            }
        };
    }, []);

    // Function to stop recording
    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop(); // Stop the recognition process
            setIsRecording(false); // Update recording state
            setRecordingComplete(true); // Mark recording as complete

            // Use a short timeout to ensure recognition finalizes
            setTimeout(() => {
                onTranscriptChange(transcript); // Pass the latest transcript to the parent
            }, 500); // Timeout duration can be adjusted
        }
    };
       
    // Function to toggle the recording state
    const handleToggleRecording = () => {
        setIsRecording(!isRecording); // Toggle the recording state
        if (!isRecording) {
            startRecording(); // Start recording if not already recording
        } else {
            stopRecording(); // Stop recording if currently recording
        }
    };

    return (
        <div>
            {/* Button to start/stop recording, changing label accordingly */}
            <button 
                onClick={handleToggleRecording} 
                className="absolute right-0 top-10 rounded-full bg-blue-500 text-white p-3 hover:bg-blue-600"
            >
                {isRecording ? "Stop Recording" : "Start Recording"} {/* Change button text based on recording state */}
            </button>
        </div>
    );
}