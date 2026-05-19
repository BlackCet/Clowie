package com.example.Clowie;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleItemRepository extends JpaRepository<ScheduleItem, Long> {
   
    List<ScheduleItem> findByScheduledTime(LocalDateTime scheduledTime);
    List<ScheduleItem> findByScheduledTimeBetweenAndReminderSentFalse(LocalDateTime start, LocalDateTime end);
    List<ScheduleItem> findByUserEmail(String userEmail);
    List<ScheduleItem> findByUserEmailAndScheduledTime(String userEmail, java.time.LocalDateTime scheduledTime);
}   