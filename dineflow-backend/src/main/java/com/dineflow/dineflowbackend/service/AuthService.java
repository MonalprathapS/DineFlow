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

    @Value("${jwt.access-token-expiration}")
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
        user.setIsActive(true);

        userRepository.save(user);
        return "User Registered Successfully";
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsActive()) {
            throw new RuntimeException("User account is disabled");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtUtil.generateAccessToken(userDetails, user.getId(), user.getRole().name());
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

   public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("========== LOGIN DEBUG ==========");
    System.out.println("Email: " + request.getEmail());
    System.out.println("Password Entered: " + request.getPassword());
    System.out.println("DB Hash: " + user.getPassword());
    System.out.println("Password Matches: " +
            passwordEncoder.matches(request.getPassword(), user.getPassword()));
    System.out.println("=================================");

    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
    );

    if (!user.getIsActive()) {
        throw new RuntimeException("User account is disabled");
    }

    UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
    String accessToken = jwtUtil.generateAccessToken(userDetails, user.getId(), user.getRole().name());
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
