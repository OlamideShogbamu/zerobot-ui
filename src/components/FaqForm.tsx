'use client';

import { useState } from 'react';

export default function FaqBotForm() {
  const [faqBotName, setFaqBotName] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [questions, setQuestions] = useState([{ q: '', a: '' }, { q: '', a: '' }]);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('Open AI');
  const [document, setDocument] = useState<File | null>(null);
  const [faqJsonFile, setFaqJsonFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    const botData = {
      name: faqBotName,
      greeting: defaultMessage,
      fallback: "I'm sorry, I don't have an answer yet.",
      faq: questions,
      llm_provider: provider,
      llm_api_key: apiKey,
    };

    formData.append("bot_data", JSON.stringify(botData));

    // Append the uploaded JSON file if it exists
    if (faqJsonFile) {
      formData.append("faq_json", faqJsonFile);
    }

    // Append the uploaded document if it exists
    if (document) {
      formData.append("document", document);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/faq/create_faq_bot/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const result = await response.json();
      alert(`Success! Bot ID: ${result.bot_id}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-l font-bold mb-2">FAQ bot name</h2>
      <input
        type="text"
        placeholder="Enter bot name"
        className="w-full border border-gray-300 rounded p-2 mb-5 placeholder:text-sm"
        value={faqBotName}
        onChange={(e) => setFaqBotName(e.target.value)}
      />

      <h2 className="text-l font-bold mb-2">Default message</h2>
      <input
        type="text"
        placeholder="Enter default message"
        className="w-full border border-gray-300 rounded p-2 mb-5 placeholder:text-sm"
        value={defaultMessage}
        onChange={(e) => setDefaultMessage(e.target.value)}
      />

      <h2 className="text-l font-bold mb-2">Bot messages</h2>
      {questions.map((pair, index) => (
        <div className="grid grid-cols-2 gap-4 mb-4" key={index}>
          <input
            type="text"
            placeholder={`Question ${index + 1}`}
            className="border border-gray-300 rounded p-2 placeholder:text-sm"
            value={pair.q}
            onChange={(e) => {
              const updated = [...questions];
              updated[index].q = e.target.value;
              setQuestions(updated);
            }}
          />
          <input
            type="text"
            placeholder={`Answer ${index + 1}`}
            className="border border-gray-300 rounded p-2 placeholder:text-sm"
            value={pair.a}
            onChange={(e) => {
              const updated = [...questions];
              updated[index].a = e.target.value;
              setQuestions(updated);
            }}
          />
        </div>
      ))}

    <div className="text-sm text-gray-500 mb-6">
    <span
        onClick={() =>
        setQuestions((prev) => [...prev, { q: '', a: '' }])
        }
        className="text-blue-600 underline cursor-pointer hover:text-blue-800 mr-2"
    >
        Add more question and answer
    </span>
    •{' '}
    <label
        htmlFor="jsonUpload"
        className="text-blue-600 underline cursor-pointer hover:text-blue-800"
    >
        Upload JSON
    </label>
    <input
        id="jsonUpload"
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                console.log("Uploaded JSON:", json);
                // Optional: Validate format before updating
                if (Array.isArray(json) && json.every(item => 'q' in item && 'a' in item)) {
                setQuestions(json);
                } else {
                alert("Invalid format. JSON must be an array of {q, a} objects.");
                }
            } catch (err) {
                alert("Invalid JSON file");
            }
            };
            reader.readAsText(file);
        }
        }}
    />
    </div>

    <h2 className="text-l font-bold mb-2">Use AI</h2>
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
    <div className="mb-5 text-sm">
        <label className="block text-gray-600 text-sm mb-1">Select LLM provider</label>
        <select
        className="w-full border border-gray-300 rounded p-2 text-sm"
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        >
        <option>Open AI</option>
        <option>Cohere</option>
        <option>groq-llama</option>
        <option>Anthropic</option>
        </select>
    </div>

    <div className="mb-4">
        <label className="block text-gray-600 text-sm mb-2">Upload document</label>
        <div className="border border-dashed border-gray-400 rounded p-6 text-center">
        <input type="file" className="hidden" id="fileUpload" onChange={handleFileUpload} />
        <label htmlFor="fileUpload" className="cursor-pointer text-gray-500">
            <div className="text-4xl mb-2">⬆️</div>
            {document ? document.name : 'Upload document'}
        </label>
        </div>
    </div>

    <div>
        <label className="block text-gray-600 text-sm mb-2">API key</label>
        <input
        type="text"
        className="w-full border border-gray-300 rounded p-2 placeholder:text-sm"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        />
    </div>
    </div>

    <button
        onClick={handleSubmit}
        className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 font-semibold"
        disabled={loading}
    >
        {loading ? 'Creating...' : 'Create Bot'}
    </button>
    </div>
  );
}
