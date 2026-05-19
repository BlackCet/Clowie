package com.example.Clowie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendReminderEmail(String toEmail, ScheduleItem event) {
        sendReminderEmail(toEmail, event, null);
    }

    public void sendReminderEmail(String toEmail, ScheduleItem event, String reminderLabel) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        String prefix = (reminderLabel != null && !reminderLabel.isEmpty()) ? "(" + reminderLabel + " reminder) " : "";
        message.setSubject("⏰ " + prefix + "Clowie Reminder: " + event.getTitle());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d 'at' h:mm a");
        String formattedTime = event.getScheduledTime().format(formatter);

        String body = "✨ Hi there!\n\n" +
                "Clowie here with a quick reminder for your upcoming " + event.getType().toLowerCase() + ".\n\n" +
                "📌 What: " + event.getTitle() + "\n" +
                "⏰ When: " + formattedTime + "\n\n" +
                "💬 You told me: \"" + event.getOriginalPrompt() + "\"\n\n" +
                "You've got this!\n" +
                "🌸 Your AI Assistant, Clowie";

        message.setText(body);

        System.out.println("Sending reminder email from " + fromEmail + " to " + toEmail + " (" + (reminderLabel == null ? "default" : reminderLabel) + ")");
        mailSender.send(message);
        System.out.println("Email successfully sent to " + toEmail + " (" + (reminderLabel == null ? "default" : reminderLabel) + ")");
    }
}