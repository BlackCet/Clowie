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

    private String title;
    private String type; 
    private String originalPrompt; 
    
    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime; 

    // --- THE ONLY REMINDER STATE COLUMN WE NEED NOW ---
    @Column(name = "reminder_flags")
    private int reminderFlags = 0; 

    // --- BITMASK CONSTANTS ---
    public static final int FLAG_ONE_WEEK = 1;
    public static final int FLAG_THREE_DAYS = 2;
    public static final int FLAG_ONE_DAY = 4;
    public static final int FLAG_TWO_HOURS = 8;
    public static final int FLAG_ONE_HOUR = 16;
    public static final int FLAG_THIRTY_MINUTES = 32;
    public static final int FLAG_TEN_MINUTES = 64;

    public ScheduleItem() {}

    public ScheduleItem(String title, String type, String originalPrompt, LocalDateTime scheduledTime) {
        this.title = title;
        this.type = type;
        this.originalPrompt = originalPrompt;
        this.scheduledTime = scheduledTime;
    }

    public Long getId() { return id; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getOriginalPrompt() { return originalPrompt; }
    public void setOriginalPrompt(String originalPrompt) { this.originalPrompt = originalPrompt; }
    
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public int getReminderFlags() { return reminderFlags; }
    public void setReminderFlags(int reminderFlags) { this.reminderFlags = reminderFlags; }

    // --- BITWISE HELPER METHODS ---
    public boolean isReminderSent(int flag) {
        return (this.reminderFlags & flag) == flag;
    }

    public void markReminderSent(int flag) {
        this.reminderFlags |= flag;
    }
}