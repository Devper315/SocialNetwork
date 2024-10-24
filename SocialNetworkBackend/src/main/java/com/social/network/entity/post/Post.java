package com.social.network.entity.post;

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
    String content;

    @OneToMany (mappedBy = "post")
    List<Image> imageList;

    @ManyToOne
    User author;
    LocalDateTime createdTime;
    LocalDateTime updatedTime;
    String status;

}
