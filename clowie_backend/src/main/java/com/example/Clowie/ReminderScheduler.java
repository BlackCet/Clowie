package com.example.Clowie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReminderScheduler {

    @Autowired
    private ScheduleItemRepository repository;

    @Autowired
    private EmailService emailService;

    // every 60 seconds, check for events happening in the next 15 minutes
    @Scheduled(fixedRate = 60000) 
    public void checkUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fifteenMinutesFromNow = now.plusMinutes(15);

        
        List<ScheduleItem> upcomingEvents = repository.findByScheduledTimeBetweenAndReminderSentFalse(now, fifteenMinutesFromNow);

        for (ScheduleItem event : upcomingEvents) {
            
            
            if (event.getUserEmail() != null && !event.getUserEmail().isEmpty()) {
                
            
                emailService.sendReminderEmail(event.getUserEmail(), event);
                
                
                event.setReminderSent(true);
                repository.save(event);
                
                System.out.println("Automated reminder sent to: " + event.getUserEmail());
            } else {
                System.out.println("Skipped event ID " + event.getId() + " because it has no owner email.");
            }
        }
    }
}