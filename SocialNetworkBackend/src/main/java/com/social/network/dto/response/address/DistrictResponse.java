package com.social.network.dto.response.address;

import com.social.network.entity.address.District;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DistrictResponse {
    Long id;
    String name;

    public DistrictResponse(District district){
        this.id = district.getId();
        this.name = district.getName();
    }
}
