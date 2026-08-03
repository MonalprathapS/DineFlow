package com.dineflow.dineflowbackend.dto;

import com.dineflow.dineflowbackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private Long userId;
    private String name;
    private String email;
    private UserRole role;

    public LoginResponse(String accessToken, String refreshToken, Long expiresIn,
                         Long userId, String name, String email, UserRole role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
