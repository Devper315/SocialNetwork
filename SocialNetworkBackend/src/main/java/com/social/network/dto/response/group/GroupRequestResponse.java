package com.social.network.dto.response.group;

import com.social.network.entity.group.GroupRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupRequestResponse {
    String groupName;
    LocalDateTime requestTime;
    String userFullname;
    Long id;

    public GroupRequestResponse(GroupRequest groupRequest) {
        this.groupName= groupRequest.getGroup().getName();
        this.requestTime= LocalDateTime.now();
        this.userFullname=groupRequest.getUser().getFullName();
        this.id=groupRequest.getId();


    }


}
