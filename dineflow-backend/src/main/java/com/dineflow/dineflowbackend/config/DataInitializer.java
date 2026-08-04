package com.dineflow.dineflowbackend.config;

import com.dineflow.dineflowbackend.entity.User;
import com.dineflow.dineflowbackend.entity.UserRole;
import com.dineflow.dineflowbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findByEmail("admin@dineflow.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("admin123"));
                user.setRole(UserRole.ADMIN);
                user.setActive(true);
                userRepository.save(user);
                System.out.println("=========================================");
                System.out.println(">>> ADMIN PASSWORD ENCODED & UPDATED <<<");
                System.out.println("=========================================");
            },
            () -> {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@dineflow.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(UserRole.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("=========================================");
                System.out.println(">>> NEW ADMIN ACCOUNT CREATED & SAVED <<<");
                System.out.println("=========================================");
            }
        );
    }
}