package com.social.network.repository.group;

import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.group.GroupMemberId;
import com.social.network.entity.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Member;
import java.util.List;

@Repository
public interface GroupMemberRepo extends JpaRepository<GroupMember, GroupMemberId> {
    @Transactional
    @Modifying
    void deleteByGroupAndMember(Group group, User member);

    List<GroupMember> findByGroup(Group group);
    boolean existsByGroupAndMember(Group group, User member);
}
