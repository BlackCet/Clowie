package com.example.Clowie;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ClowieAgentService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public ScheduleItem processPrompt(String userPrompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();


            String currentSystemTime = java.time.LocalDateTime.now().toString();

        
            String systemInstruction = "You are Clowie, an AI scheduling assistant. " +
                "The current date and time is: " + currentSystemTime + ". " +
                "Extract the core task from the user's prompt. " +
                "Return EXACTLY a JSON object with three fields: " +
                "'title' (a short summary), " +
                "'type' (MEETING, TASK, or REMINDER), and " +
                "'scheduledTime' (Calculate this based on the user prompt relative to the current time. MUST be strict ISO-8601 format: YYYY-MM-DDTHH:mm:ss. If no time is implied, return null). " +
                "Do not include markdown.";

            String requestBody = "{" +
                "\"system_instruction\": {\"parts\": [{\"text\": \"" + systemInstruction + "\"}]}," +
                "\"contents\": [{\"parts\":[{\"text\": \"" + userPrompt + "\"}]}]" +
            "}";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            String fullUrl = apiUrl + apiKey;
            String responseStr = restTemplate.postForObject(fullUrl, request, String.class);

            JsonNode rootNode = mapper.readTree(responseStr);
            String aiExtractedText = rootNode.path("candidates").get(0)
                                             .path("content").path("parts").get(0)
                                             .path("text").asText().trim();

            aiExtractedText = aiExtractedText.replace("```json", "").replace("```", "");
            JsonNode aiJson = mapper.readTree(aiExtractedText);

            
            java.time.LocalDateTime extractedTime = null;
            if (aiJson.hasNonNull("scheduledTime")) {
                try {
                    extractedTime = java.time.LocalDateTime.parse(aiJson.get("scheduledTime").asText());
                } catch (Exception e) {
                    System.err.println("Could not parse AI time: " + e.getMessage());
                }
            }

           
            return new ScheduleItem(
                aiJson.get("title").asText(),
                aiJson.get("type").asText(),
                userPrompt,
                extractedTime
            );

        } catch (Exception e) {
            System.err.println("AI Processing Failed: " + e.getMessage());
            return new ScheduleItem("Uncategorized Task", "UNKNOWN", userPrompt, null);
        }
    }
}