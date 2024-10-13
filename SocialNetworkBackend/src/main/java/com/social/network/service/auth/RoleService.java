package com.social.network.service.auth;

import com.social.network.entity.user.Role;
import com.social.network.repository.auth.RoleRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepo roleRepo;

    public Role getByName(String name){
        return roleRepo.findByName(name);
    }
}
