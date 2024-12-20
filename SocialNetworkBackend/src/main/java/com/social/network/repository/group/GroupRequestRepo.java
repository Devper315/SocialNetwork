package com.social.network.repository.group;

import com.social.network.entity.group.GroupRequest;
import com.social.network.entity.group.Group;
import com.social.network.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRequestRepo extends JpaRepository<GroupRequest, Long> {

    List<GroupRequest> findByGroup(Group group);

    boolean existsByGroupAndRequestor(Group group, User requestor);

}
