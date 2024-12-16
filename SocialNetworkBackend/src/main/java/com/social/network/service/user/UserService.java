package com.social.network.service.user;

import com.social.network.dto.user.ChangePasswordRequest;
import com.social.network.dto.user.UserDTO;
import com.social.network.dto.user.ProfileUpdateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.entity.user.EmailVerification;
import com.social.network.entity.user.Role;
import com.social.network.entity.user.User;
import com.social.network.exception.AppException;
import com.social.network.exception.ErrorCode;
import com.social.network.repository.user.EmailVerificationRepo;
import com.social.network.repository.user.UserRepo;
import com.social.network.service.EmailService;
import com.social.network.service.auth.RoleService;
import com.social.network.utils.PageableUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepo userRepo;
    PasswordEncoder passwordEncoder;
    RoleService roleService;
    EmailVerificationRepo emailVerificationRepo;
    EmailService emailService;


    public List<User> getAll() {
        return userRepo.findAll();
    }

    public User getById(Long id) {
        return userRepo.findById(id).orElseThrow();
    }

    public List<User> getByIds(List<Long> ids){
        return userRepo.findAllById(ids);
    }

    public void createUser(UserDTO request) {
        if (userRepo.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);
        if (userRepo.existsByEmail(request.getEmail()))
            throw new AppException(ErrorCode.EMAIL_USED);
        User user = new User(request);
        user.setFullName(user.getFirstName() + " " + user.getLastName());
        user.setEmail(user.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        List<Role> roles = new ArrayList<>();
        roles.add(roleService.getByName("USER"));
        user.setRoles(roles);
        EmailVerification emailVerification = EmailVerification.builder()
                .user(user).token(UUID.randomUUID().toString())
                .expiryTime(LocalDateTime.now().plusHours(1))
                .build();
        userRepo.save(user);
        emailVerificationRepo.save(emailVerification);
        emailService.sendHtmlEmail(request.getEmail(), user.getFullName(), emailVerification.getToken());
    }

    public User getCurrentUser() {
        return getByUsername(getLoginUsername());
    }

    public String getLoginUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public User getByUsername(String username) {
        return userRepo.findByUsernameAndActive(username.toLowerCase(), true);
    }

    public Boolean updateUser(ProfileUpdateRequest request) {
        User user = getCurrentUser();
        user.setAvatarUrl(request.getAvatarUrl());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setFullName(user.getFirstName() + " " + user.getLastName());
        user.setDateOfBirth(request.getDateOfBirth());
        userRepo.save(user);
        return true;
    }

    public ApiResponse<String> changePassword(ChangePasswordRequest request, Authentication auth) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.WRONG_CURRENT_PASSWORD);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
        return ApiResponse.<String>builder()
                .result("Đổi mật khẩu thành công")
                .build();
    }

    public Page<UserDTO> search(String keyword, int page, int size){
        User requestor = getCurrentUser();
        Pageable pageable = PageableUtils.createPageable(page, size, "lastName");
        keyword = "%" + keyword + "%";
        Page<User> resultPage = userRepo.search(requestor, keyword, pageable);
        return resultPage.map(UserDTO::new);
    }


    public Boolean verifyEmail(String token) {
        EmailVerification emailVerification = emailVerificationRepo.findByToken(token);
        if (emailVerification != null && !emailVerification.isExpired()){
            User newUser = emailVerification.getUser();
            newUser.setActive(true);
            userRepo.save(newUser);
            emailVerificationRepo.delete(emailVerification);
            return true;
        }
        return false;
    }


}
