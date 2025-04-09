export interface BotPayload {
    name: string;
    default_message: string;
    faq: { q: string; a: string }[];
    llm_provider: string;
    llm_api_key: string;
  }
  
  export interface BotResponse {
    bot_id: string;
    message: string;
  }
  
  export const createFaqBot = async (
    botData: BotPayload,
    faqJsonFile: File | null,
    documentFile: File | null
  ): Promise<BotResponse> => {
    const formData = new FormData();
    formData.append("bot_data", JSON.stringify(botData));
  
    if (faqJsonFile) {
      formData.append("faq_json", faqJsonFile);
    }
  
    if (documentFile) {
      formData.append("document", documentFile);
    }
  
    const response = await fetch("/api/create_faq_bot/", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to create bot");
    }
  
    return response.json();
  };
  