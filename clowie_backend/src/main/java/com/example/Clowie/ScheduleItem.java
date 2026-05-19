package com.example.Clowie;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_items")
public class ScheduleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_email")
    private String userEmail;

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    private String title;
    private String type; 
    private String originalPrompt; 
    
    
    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime; 

    public ScheduleItem() {}

    public ScheduleItem(String title, String type, String originalPrompt, LocalDateTime scheduledTime) {
        this.title = title;
        this.type = type;
        this.originalPrompt = originalPrompt;
        this.scheduledTime = scheduledTime;
    }

    
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getOriginalPrompt() { return originalPrompt; }
    public void setOriginalPrompt(String originalPrompt) { this.originalPrompt = originalPrompt; }
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    
    private boolean reminderSent = false;

    
    public boolean isReminderSent() { return reminderSent; }
    public void setReminderSent(boolean reminderSent) { this.reminderSent = reminderSent; }
}

