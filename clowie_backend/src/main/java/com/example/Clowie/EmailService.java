package com.example.Clowie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReminderEmail(String toEmail, ScheduleItem event) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom("anushka0001true@gmail.com"); // Can be anything
        message.setTo(toEmail);
        message.setSubject("⏰ Clowie Reminder: " + event.getTitle());
        
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
        
        mailSender.send(message);
        System.out.println("Email successfully sent to " + toEmail);
    }
}