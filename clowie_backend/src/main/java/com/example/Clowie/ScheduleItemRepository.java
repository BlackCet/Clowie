package com.example.Clowie;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleItemRepository extends JpaRepository<ScheduleItem, Long> {
   
    List<ScheduleItem> findByScheduledTime(LocalDateTime scheduledTime);
    
    // The scheduler now relies entirely on this method:
    List<ScheduleItem> findByScheduledTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<ScheduleItem> findByUserEmail(String userEmail);
    
    List<ScheduleItem> findByUserEmailAndScheduledTime(String userEmail, LocalDateTime scheduledTime);
}