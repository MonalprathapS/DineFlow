package com.dineflow.dineflowbackend.dto;

import com.dineflow.dineflowbackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
