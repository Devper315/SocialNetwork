package com.social.network.repository.group;

import com.social.network.entity.group.GroupRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRoleRepo extends JpaRepository<GroupRole, Long> {
    Optional<GroupRole> findById(Long id);
}