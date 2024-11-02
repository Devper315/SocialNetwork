package com.social.network.repository.group;

import com.social.network.entity.group.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepo extends JpaRepository<Group, Long> {
    @Query("SELECT g FROM Group g WHERE LOWER(g.name) LIKE LOWER(:keyword)")
    Page<Group> search(String keyword, Pageable pageable);
}