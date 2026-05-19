package com.example.Clowie;

import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@RestController
@RequestMapping("/api")
public class ScheduleController {

    @Autowired
    private ScheduleItemRepository repository;

    @Autowired
    private ClowieAgentService aiAgent;

    @Value("${google.client.id}")
    private String googleClientId;

  
    private String verifyAndGetEmail(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized: No token provided");
        }
        
        try {
            String idTokenString = authHeader.substring(7);
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload().getEmail();
            } else {
                throw new RuntimeException("Unauthorized: Invalid Google token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Unauthorized: Validation failed - " + e.getMessage());
        }
    }



    @PostMapping("/schedule")
    public String receiveScheduleRequest(@RequestHeader("Authorization") String authHeader, @RequestBody String userPrompt) {
        
        String userEmail = verifyAndGetEmail(authHeader);
        System.out.println("Processing prompt for " + userEmail + ": " + userPrompt);

       
        ScheduleItem intelligentItem = aiAgent.processPrompt(userPrompt);
        
       
        intelligentItem.setUserEmail(userEmail);

        
        if (intelligentItem.getScheduledTime() != null) {
            List<ScheduleItem> conflicts = repository.findByUserEmailAndScheduledTime(userEmail, intelligentItem.getScheduledTime());
            
            if (!conflicts.isEmpty()) {
                ScheduleItem existingEvent = conflicts.get(0);
                return "⚠️ CLASH DETECTED! Clowie stopped the save. You already have a [" + 
                       existingEvent.getType() + "] titled '" + existingEvent.getTitle() + 
                       "' scheduled for this exact time (" + intelligentItem.getScheduledTime() + ").";
            }
        }

        
        repository.save(intelligentItem);
        return "Clowie understood this as a [" + intelligentItem.getType() + 
               "] titled '" + intelligentItem.getTitle() + "'. Saved to database!";
    }

    @DeleteMapping("/events/{id}")
    public String deleteEvent(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        String userEmail = verifyAndGetEmail(authHeader);
        
        
        ScheduleItem item = repository.findById(id).orElse(null);
        
        if (item != null && item.getUserEmail().equals(userEmail)) {
            repository.delete(item);
            return "Event deleted successfully.";
        }
        
        return "Delete failed: Event not found or unauthorized.";
    }

    @GetMapping("/events")
    public List<ScheduleItem> getAllScheduledItems(@RequestHeader("Authorization") String authHeader) {
        String userEmail = verifyAndGetEmail(authHeader);
        System.out.println("Fetching calendar for: " + userEmail);
        
       
        return repository.findByUserEmail(userEmail);
    }
}