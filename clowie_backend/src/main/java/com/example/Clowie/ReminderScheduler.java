package com.example.Clowie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class ReminderScheduler {

    @Autowired
    private ScheduleItemRepository repository;

    @Autowired
    private EmailService emailService;

    // every 60 seconds, check for events and send any due reminders
    @Scheduled(fixedRate = 60000)
    public void checkUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();

        // look ahead up to 8 days to cover the 1-week reminder plus margin
        LocalDateTime lookahead = now.plusWeeks(1).plusDays(1);

        List<ScheduleItem> upcomingEvents = repository.findByScheduledTimeBetween(now, lookahead);

        // tolerance in seconds to match scheduled-time +/- window
        final long TOL_SECONDS = 60; // 60s tolerance

        final long ONE_WEEK = ChronoUnit.SECONDS.between(now, now.plusWeeks(1));
        final long THREE_DAYS = ChronoUnit.SECONDS.between(now, now.plusDays(3));
        final long ONE_DAY = ChronoUnit.SECONDS.between(now, now.plusDays(1));
        final long TWO_HOURS = ChronoUnit.SECONDS.between(now, now.plusHours(2));
        final long ONE_HOUR = ChronoUnit.SECONDS.between(now, now.plusHours(1));
        final long THIRTY_MINUTES = ChronoUnit.SECONDS.between(now, now.plusMinutes(30));
        final long TEN_MINUTES = ChronoUnit.SECONDS.between(now, now.plusMinutes(10));

        for (ScheduleItem event : upcomingEvents) {
            if (event.getUserEmail() == null || event.getUserEmail().isEmpty()) {
                System.out.println("Skipped event ID " + event.getId() + " because it has no owner email.");
                continue;
            }

            long secondsUntil = ChronoUnit.SECONDS.between(now, event.getScheduledTime());

            try {
                // 1 week before
                if (!event.isReminderSent(ScheduleItem.FLAG_ONE_WEEK) && Math.abs(secondsUntil - ONE_WEEK) <= TOL_SECONDS) {
                    emailService.sendReminderEmail(event.getUserEmail(), event, "1 week");
                    event.markReminderSent(ScheduleItem.FLAG_ONE_WEEK);
                    repository.save(event);
                    System.out.println("1-week reminder sent to: " + event.getUserEmail());
                }

                // 3 days before
                if (!event.isReminderSent(ScheduleItem.FLAG_THREE_DAYS) && Math.abs(secondsUntil - THREE_DAYS) <= TOL_SECONDS) {
                    emailService.sendReminderEmail(event.getUserEmail(), event, "3 days");
                    event.markReminderSent(ScheduleItem.FLAG_THREE_DAYS);
                    repository.save(event);
                    System.out.println("3-day reminder sent to: " + event.getUserEmail());
                }

                // 1 day before
                if (!event.isReminderSent(ScheduleItem.FLAG_ONE_DAY) && Math.abs(secondsUntil - ONE_DAY) <= TOL_SECONDS) {
                    emailService.sendReminderEmail(event.getUserEmail(), event, "1 day");
                    event.markReminderSent(ScheduleItem.FLAG_ONE_DAY);
                    repository.save(event);
                    System.out.println("1-day reminder sent to: " + event.getUserEmail());
                }

                // 2 hours before
                if (!event.isReminderSent(ScheduleItem.FLAG_TWO_HOURS) && Math.abs(secondsUntil - TWO_HOURS) <= TOL_SECONDS) {
                    emailService.sendReminderEmail(event.getUserEmail(), event, "2 hours");
                    event.markReminderSent(ScheduleItem.FLAG_TWO_HOURS);
                    repository.save(event);
                    System.out.println("2-hour reminder sent to: " + event.getUserEmail());
                }

                // 1 hour before
                if (!event.isReminderSent(ScheduleItem.FLAG_ONE_HOUR) && Math.abs(secondsUntil - ONE_HOUR) <= TOL_SECONDS) {
                    emailService.sendReminderEmail(event.getUserEmail(), event, "1 hour");
                    event.markReminderSent(ScheduleItem.FLAG_ONE_HOUR);
                    repository.save(event);
                    System.out.println("1-hour reminder sent to: " + event.getUserEmail());
                }

                // 30 minutes before
                if (!event.isReminderSent(ScheduleItem.FLAG_THIRTY_MINUTES) && Math.abs(secondsUntil - THIRTY_MINUTES) <= TOL_SECONDS) {
                    emailService.sendReminderEmail(event.getUserEmail(), event, "30 minutes");
                    event.markReminderSent(ScheduleItem.FLAG_THIRTY_MINUTES);
                    repository.save(event);
                    System.out.println("30-minute reminder sent to: " + event.getUserEmail());
                }

                // 10 minutes before
                if (!event.isReminderSent(ScheduleItem.FLAG_TEN_MINUTES) && Math.abs(secondsUntil - TEN_MINUTES) <= TOL_SECONDS) {
                    emailService.sendReminderEmail(event.getUserEmail(), event, "10 minutes");
                    event.markReminderSent(ScheduleItem.FLAG_TEN_MINUTES);
                    repository.save(event);
                    System.out.println("10-minute reminder sent to: " + event.getUserEmail());
                }

            } catch (Exception ex) {
                System.out.println("Failed to send reminder for event ID " + event.getId() + ": " + ex.getMessage());
            }
        }
    }
}