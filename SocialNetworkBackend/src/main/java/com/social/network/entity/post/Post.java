package com.social.network.entity.post;

import com.social.network.entity.group.Group;
import com.social.network.entity.image.Image;
import com.social.network.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "content", length = 65535)
    String content;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    List<Image> imageList;

    @ManyToOne
    User author;

    LocalDateTime createdTime;
    LocalDateTime updatedTime;


    @ManyToOne
    @JoinColumn(name = "group_id", nullable = true)
    Group group;

    @Column(nullable = true)
    Long approvalStatus;
}
