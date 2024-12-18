package com.social.network.entity.group;

import com.social.network.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    Group group;

    @ManyToOne
    User user;

    @Column(name = "request_time", nullable = false)
    LocalDateTime time;

    @Column(name = "status", nullable = false)
    Integer status; //0=dang cho, 1=dong y, 2=tu choi

}
