package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.LoginRequest;
import com.dineflow.dineflowbackend.dto.LoginResponse;
import com.dineflow.dineflowbackend.dto.RefreshTokenRequest;
import com.dineflow.dineflowbackend.dto.RegisterRequest;
import com.dineflow.dineflowbackend.entity.User;
import com.dineflow.dineflowbackend.repository.UserRepository;
import com.dineflow.dineflowbackend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Value("${jwt.access-token-expiration:86400000}")
    private Long accessTokenExpiration;

    private final Set<String> invalidatedTokens = new HashSet<>();

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        user.setActive(true);

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid admin credentials"));

        System.out.println("========== BCRYPT DIAGNOSTIC ==========");
        System.out.println("Entered Raw Password: " + request.getPassword());
        System.out.println("Stored DB Password:  " + user.getPassword());
        System.out.println("Fresh Encoded Hash:  " + passwordEncoder.encode("admin123"));
        System.out.println("Matches Result:      " + passwordEncoder.matches(request.getPassword(), user.getPassword()));
        System.out.println("=======================================");

        if (!user.getActive()) {
            throw new RuntimeException("User account is disabled");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        String accessToken = jwtUtil.generateAccessToken(
                userDetails,
                user.getId(),
                user.getRole().name()
        );

        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return new LoginResponse(
                accessToken,
                refreshToken,
                accessTokenExpiration / 1000,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public LoginResponse refreshToken(RefreshTokenRequest request) {

        String refreshToken = request.getRefreshToken();

        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String email = jwtUtil.extractUsername(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        String accessToken = jwtUtil.generateAccessToken(
                userDetails,
                user.getId(),
                user.getRole().name()
        );

        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        return new LoginResponse(
                accessToken,
                newRefreshToken,
                accessTokenExpiration / 1000,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        invalidatedTokens.add(token);
    }

    public boolean isTokenInvalidated(String token) {
        return invalidatedTokens.contains(token);
    }
}