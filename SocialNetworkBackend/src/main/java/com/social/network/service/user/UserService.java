package com.social.network.service.user;

import com.social.network.dto.request.user.ChangePasswordRequest;
import com.social.network.dto.request.user.UserCreateRequest;
import com.social.network.dto.request.user.UserUpdateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.user.ProfileResponse;
import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.UserConversation;
import com.social.network.entity.post.Image;
import com.social.network.entity.user.Role;
import com.social.network.entity.user.User;
import com.social.network.exception.AppException;
import com.social.network.exception.ErrorCode;
import com.social.network.mapper.UserMapper;
import com.social.network.repository.user.UserRepo;
import com.social.network.service.auth.RoleService;
import com.social.network.service.friend.FriendRequestService;
import com.social.network.service.friend.FriendshipService;
import com.social.network.service.message.UserConversationService;
import com.social.network.utils.PageableUtils;
import com.social.network.utils.UserUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepo userRepo;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleService roleService;
    UserConversationService userConversationService;


    public List<User> getAll() {
        return userRepo.findAll();
    }

    public User getById(Long id) {
        return userRepo.findById(id).orElseThrow();
    }

    public UserResponse createUser(UserCreateRequest request) {
        if (userRepo.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);
        if (userRepo.existsByEmail(request.getEmail()))
            throw new AppException(ErrorCode.EMAIL_USED);
        User user = userMapper.toUser(request);
        user.setFullName(user.getFirstName() + " " + user.getLastName());
        user.setEmail(user.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        List<Role> roles = new ArrayList<>();
        roles.add(roleService.getByName("USER"));
        user.setRoles(roles);
        user = userRepo.save(user);
        return new UserResponse(user);
    }


    public void deleteById(Long id) {
        userRepo.deleteById(id);
    }

    public User getCurrentUser() {
        return getByUsername(getLoginUsername());
    }

    public String getLoginUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public User getByUsername(String username) {
        return userRepo.findByUsername(username.toLowerCase());
    }

    public User updateUser(UserUpdateRequest request) {
        User user = getCurrentUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDateOfBirth(request.getDateOfBirth());
        return userRepo.save(user);
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

    public List<User> getByConversation(Conversation conversation) {
        List<UserConversation> userConversations = userConversationService.getByConversation(conversation);
        List<User> users = new ArrayList<>();
        for (UserConversation uc : userConversations) {
            users.add(uc.getUser());
        }
        return users;
    }

    public Page<UserResponse> search(String keyword, int page){
        User requestor = getCurrentUser();
        Pageable pageable = PageableUtils.createPageable(page, 2, "lastName");
        keyword = "%" + keyword + "%";
        Page<User> resultPage = userRepo.search(requestor, keyword, pageable);
        return resultPage.map(UserResponse::new);
    }


}
