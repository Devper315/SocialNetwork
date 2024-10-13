package com.social.network.utils;


import com.social.network.dto.response.address.DistrictResponse;
import com.social.network.dto.response.address.WardResponse;
import com.social.network.entity.address.District;
import com.social.network.entity.address.Ward;

import java.util.ArrayList;
import java.util.List;

public class AddressUtils {
    public static List<WardResponse> converWardList(List<Ward> wardList){
        List<WardResponse> result = new ArrayList<>();
        for(Ward ward: wardList) result.add(new WardResponse(ward));
        return result;
    }

    public static List<DistrictResponse> converDistrictList(List<District> districtList){
        List<DistrictResponse> result = new ArrayList<>();
        for(District district: districtList) result.add(new DistrictResponse(district));
        return result;
    }
}
